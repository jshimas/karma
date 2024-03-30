package com.jshimas.karmaapi;

import com.jshimas.karmaapi.entities.*;
import com.jshimas.karmaapi.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile("default")
@RequiredArgsConstructor
public class UsersInitializer implements CommandLineRunner {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final OrganizationRepository organizationRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("test.admin@karma.com")) {
            User user = User.builder()
                    .email("test.admin@karma.com")
                    .role(userRoleRepository.findByRoleIgnoreCase(UserRole.ADMIN).get())
                    .firstName("test")
                    .lastName("admin")
                    .accountType(accountTypeRepository.findByTypeIgnoreCase(AccountType.EMAIL).get())
                    .password(passwordEncoder.encode("testadmin")).build();

            userRepository.save(user);
        }

        if (!userRepository.existsByEmail("test.volunteer@karma.com")) {
            User user = User.builder()
                    .email("test.volunteer@karma.com")
                    .role(userRoleRepository.findByRoleIgnoreCase(UserRole.VOLUNTEER).get())
                    .firstName("test")
                    .lastName("volunteer")
                    .accountType(accountTypeRepository.findByTypeIgnoreCase(AccountType.EMAIL).get())
                    .password(passwordEncoder.encode("testvolunteer")).build();

            userRepository.save(user);
        }

        if (!userRepository.existsByEmail("simjustinas@gmail.com")) {
            Organization organization = organizationRepository.findById(
                    UUID.fromString("cbe308ea-23b7-4e7a-b07b-39ebfddbd0b7")).get();

            User user = User.builder()
                    .email("simjustinas@gmail.com")
                    .role(userRoleRepository.findByRoleIgnoreCase(UserRole.ORGANIZER).get())
                    .firstName("Justinas")
                    .lastName("Simas")
                    .organization(organization)
                    .accountType(accountTypeRepository.findByTypeIgnoreCase(AccountType.GOOGLE).get())
                    .build();

            userRepository.save(user);
        }
    }
}