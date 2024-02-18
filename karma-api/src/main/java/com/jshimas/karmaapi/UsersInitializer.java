package com.jshimas.karmaapi;

import com.jshimas.karmaapi.entities.AccountType;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.repositories.AccountTypeRepository;
import com.jshimas.karmaapi.repositories.UserRepository;
import com.jshimas.karmaapi.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("default")
@RequiredArgsConstructor
public class UsersInitializer implements CommandLineRunner {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final AccountTypeRepository accountTypeRepository;

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
    }
}