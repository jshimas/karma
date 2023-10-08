package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.UserMapper;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.Organizer;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.repositories.OrganizationRepository;
import com.jshimas.karmaapi.repositories.OrganizerRepository;
import com.jshimas.karmaapi.repositories.UserRepository;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.OrganizationService;
import com.jshimas.karmaapi.services.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final OrganizationRepository organizationRepository;
    private final OrganizerRepository organizerRepository;

    @Override
    public User findEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(User.class, id));
    }

    @Override
    @Transactional
    public UserViewDTO create(UserCreateDTO userCreateDTO) {
        validateInput(userCreateDTO);

        User user = createUser(userCreateDTO);

        User createdUser = userRepository.save(user);

        handleOrganizerRole(userCreateDTO, createdUser);

        return userMapper.toDTO(createdUser);
    }

    private void validateInput(UserCreateDTO userCreateDTO) {
        String role = userCreateDTO.role();

        if (userRepository.findByEmail(userCreateDTO.email()).isPresent()) {
            throw new ValidationException("User with this email already exists.");
        }

        if (!userCreateDTO.password().equals(userCreateDTO.passwordConfirm())) {
            throw new ValidationException("Passwords don't match!");
        }

        if (role.equalsIgnoreCase(UserRole.ORGANIZER) && userCreateDTO.organizationId() == null) {
            throw new ValidationException("organizationId is required for the organizer role.");
        }
    }

    private User createUser(UserCreateDTO userCreateDTO) {
        String role = userCreateDTO.role();
        role = role.equalsIgnoreCase(UserRole.ORGANIZER) ? UserRole.UNVERIFIED_ORGANIZER : role;

        User user = userMapper.create(userCreateDTO, role);
        user.setPassword(passwordEncoder.encode(userCreateDTO.password()));

        return user;
    }

    private void handleOrganizerRole(UserCreateDTO userCreateDTO, User createdUser) {
        if (userCreateDTO.role().equalsIgnoreCase(UserRole.ORGANIZER)) {
            if (userCreateDTO.organizationId() == null) {
                throw new ValidationException("organizationId is required for the organizer role.");
            }

            Organization organization = organizationRepository.findById(userCreateDTO.organizationId())
                    .orElseThrow(() -> new NotFoundException(Organization.class, userCreateDTO.organizationId()));

            Organizer organizer = Organizer.builder()
                    .organization(organization)
                    .user(createdUser)
                    .build();

            Organizer createdOrganizer = organizerRepository.save(organizer);
            organization.getOrganizers().add(createdOrganizer);
        }
    }

    @Override
    public void update(UUID userId, UserEditDTO userEditDTO) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(User.class, userId));

        userMapper.updateEntityFromDTO(userEditDTO, existingUser);
        userRepository.save(existingUser);
    }
}
