package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.AcknowledgementMapper;
import com.jshimas.karmaapi.domain.mappers.GeoPointMapper;
import com.jshimas.karmaapi.domain.mappers.UserMapper;
import com.jshimas.karmaapi.entities.*;
import com.jshimas.karmaapi.repositories.*;
import com.jshimas.karmaapi.services.*;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final OrganizationRepository organizationRepository;
    private final GeoPointMapper geoPointMapper;
    private final AcknowledgementMapper acknowledgementMapper;
    private final ScopeRepository scopeRepository;
    private final UserLocationRepository userLocationRepository;

    @Override
    public User findEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(User.class, id));
    }

    @Override
    public UserViewDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException(User.class, email));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserViewDTO create(UserCreateDTO userCreateDTO, String accountType, Organization organization) {
        if (userRepository.findByEmail(userCreateDTO.email()).isPresent()) {
            throw new ValidationException("User with this email already exists. Try to login instead.");
        }

        if (accountType.equals(AccountType.EMAIL) &&
                !userCreateDTO.password().equals(userCreateDTO.passwordConfirm())) {
            throw new ValidationException("Passwords don't match!");
        }

        User user = createUser(userCreateDTO, accountType);
        user.setOrganization(organization);

        User createdUser = userRepository.save(user);

        return userMapper.toDTO(createdUser);
    }

    private User createUser(UserCreateDTO userCreateDTO, String accountType) {
        User user = userMapper.create(userCreateDTO, accountType);

        if (accountType.equals(AccountType.EMAIL)) {
            user.setPassword(passwordEncoder.encode(userCreateDTO.password()));
        }

        return user;
    }

    @Override
    public void update(UUID userId, UserEditDTO userEditDTO) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(User.class, userId));

        // Clear all previous scopes
        existingUser.getScopes().clear();

        List<String> newScopes = userEditDTO.scopes().stream()
                .filter(scope -> !scopeRepository.existsByName(scope)).toList();

        // Create new scopes and add them to the user
        Set<Scope> scopesToAdd = newScopes.stream()
                .map(scopeName -> Scope.builder()
                        .name(scopeName)
                        .users(Set.of(existingUser))
                        .build())
                .collect(Collectors.toSet());

        scopeRepository.saveAll(scopesToAdd);

        // Add existing scopes to the user
        userEditDTO.scopes().stream()
                .filter(scope -> !newScopes.contains(scope))
                .map(scopeRepository::findByName)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .forEach(existingScope -> {
                    existingScope.getUsers().add(existingUser);
                    existingUser.getScopes().add(existingScope);
                });

        // Clear all user geolocations
        userLocationRepository.deleteAll(userLocationRepository.findByUserId(userId));
        existingUser.getLocations().clear();

        // Create new geolocations for the user
        List<UserLocation> newLocations = userEditDTO.geoLocations().stream()
                .map(userLocationDTO -> UserLocation.builder()
                        .name(userLocationDTO.name())
                        .location(geoPointMapper.geoPointDtoToPoint(userLocationDTO.location()))
                        .address(userLocationDTO.address())
                        .user(existingUser)
                        .build())
                .toList();

        userLocationRepository.saveAll(newLocations);
        existingUser.getLocations().addAll(newLocations);

        userMapper.updateEntityFromDTO(userEditDTO, existingUser);
        userRepository.save(existingUser);
    }

    @Override
    public UserViewDTO getUserInfo(UUID userId) {
        User user = findEntity(userId);

        List<Participation> participations = user.getApplications().stream()
                .flatMap(a -> a.getParticipations().stream())
                .toList();

        Integer collectedHours = participations
                .stream()
                .map(Participation::getHoursWorked)
                .filter(Objects::nonNull)
                .reduce(0, Integer::sum);

        List<String> scopes = user.getScopes().stream()
                .map(Scope::getName)
                .toList();

        List<UserLocationDTO> userLocations = user.getLocations().stream()
                .map(userLocation -> new UserLocationDTO(
                            userLocation.getId(),
                            userLocation.getName(),
                            geoPointMapper.pointToGeoPointDto(userLocation.getLocation()),
                            userLocation.getAddress())
                        )
                .toList();

        List<AcknowledgementViewDTO> userAcks = participations.stream()
                .flatMap(participation -> participation.getAcknowledgements().stream())
                .map(acknowledgementMapper::toDTO)
                .toList();

        return new UserViewDTO(
                user.getId(),
               user.getOrganization().getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getBio(),
                user.getImageUrl(),
                collectedHours,
                scopes,
                userLocations
//                userAcks
        );
    }
}
