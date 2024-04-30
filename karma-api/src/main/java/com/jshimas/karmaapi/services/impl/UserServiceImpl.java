package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.AcknowledgementMapper;
import com.jshimas.karmaapi.domain.mappers.GeoPointMapper;
import com.jshimas.karmaapi.domain.mappers.ParticipationMapper;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final GeoPointMapper geoPointMapper;
    private final AcknowledgementMapper acknowledgementMapper;
    private final ScopeRepository scopeRepository;
    private final UserLocationRepository userLocationRepository;
    private final StorageService storageService;

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

        User user = userMapper.create(userCreateDTO, accountType);

        if (accountType.equals(AccountType.EMAIL)) {
            user.setPassword(passwordEncoder.encode(userCreateDTO.password()));
        }

        user.setOrganization(organization);

        User createdUser = userRepository.save(user);

        setScopesForUser(createdUser, userCreateDTO.scopes());
        setLocationsForUser(createdUser, userCreateDTO.geoLocations());

        return userMapper.toDTO(createdUser);
    }

    @Override
    public UserViewDTO update(UUID userId, UserEditDTO userEditDTO) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(User.class, userId));

        setScopesForUser(existingUser, userEditDTO.scopes());

        // Clear all user geolocations
        userLocationRepository.deleteAll(userLocationRepository.findByUserId(userId));
        setLocationsForUser(existingUser, userEditDTO.geoLocations());

        userMapper.updateEntityFromDTO(userEditDTO, existingUser);
        userRepository.save(existingUser);

        return getUserInfo(userId);
    }

    @Override
    public void updateProfileImage(UUID userId, MultipartFile image) {
        User user = findEntity(userId);
        setUserImage(user, image);
        userRepository.save(user);
    }

    private void setUserImage(User user, MultipartFile image) {
        if (image != null) {
            try {
                String imageUrl = storageService.saveImage(image, user.getId() + "_profile_image");
                user.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }
    }

    private void setScopesForUser(User user, List<String> scopes) {
        if (scopes == null) {
            return;
        }

        List<String> newScopes = scopes.stream()
                .filter(scope -> !scopeRepository.existsByName(scope)).toList();

        // Create new scopes and add them to the user
        Set<Scope> scopesToAdd = newScopes.stream()
                .map(scopeName -> Scope.builder()
                        .name(scopeName)
                        .users(Set.of(user))
                        .build())
                .collect(Collectors.toSet());

        scopeRepository.saveAll(scopesToAdd);

        // Add existing scopes to the user
        user.setScopes(new ArrayList<>());
        scopes.stream()
                .filter(scope -> !newScopes.contains(scope))
                .map(scopeRepository::findByName)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .forEach(existingScope -> {
                    existingScope.getUsers().add(user);
                    user.getScopes().add(existingScope);
                });
    }

    private void setLocationsForUser(User user, List<UserLocationDTO> userLocations) {
        if (userLocations == null) {
            return;
        }
        // Create new geolocations for the user
        List<UserLocation> newLocations = userLocations.stream()
                .map(userLocationDTO -> UserLocation.builder()
                        .name(userLocationDTO.name())
                        .location(geoPointMapper.geoPointDtoToPoint(userLocationDTO.location()))
                        .address(userLocationDTO.address())
                        .user(user)
                        .build())
                .toList();

        user.setLocations(new ArrayList<>());
        user.getLocations().addAll(newLocations);
        userLocationRepository.saveAll(newLocations);
    }

    @Override
    public UserViewDTO getUserInfo(UUID userId) {
        User user = findEntity(userId);
        UserViewDTO userViewDTO = userMapper.toDTO(user);

        List<UserLocationDTO> userLocations = user.getLocations().stream()
                .map(userLocation -> new UserLocationDTO(
                        userLocation.getId(),
                        userLocation.getName(),
                        geoPointMapper.pointToGeoPointDto(userLocation.getLocation()),
                        userLocation.getAddress())
                )
                .toList();

        List<AcknowledgementViewDTO> acknowledgements = user.getParticipations().stream().flatMap(participation -> participation.getAcknowledgements().stream())
                .map(acknowledgementMapper::toDTO)
                .toList();

        return new UserViewDTO(
                userViewDTO.id(),
                userViewDTO.organizationId(),
                userViewDTO.firstName(),
                userViewDTO.lastName(),
                userViewDTO.email(),
                userViewDTO.role(),
                userViewDTO.bio(),
                userViewDTO.imageUrl(),
                userViewDTO.karmaPoints(),
                userViewDTO.scopes(),
                userLocations,
                userViewDTO.participations(),
                userViewDTO.prizes(),
                acknowledgements
        );
    }
}
