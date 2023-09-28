package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.UserMapper;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.UserRepository;
import com.jshimas.karmaapi.security.SecurityUser;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username is the email in this case
        return userRepository.findByEmail(username)
                .map(SecurityUser::new)
                .orElseThrow(() -> new UsernameNotFoundException("Username with email: " + username + " not found"));
    }

    @Override
    public User findEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(User.class, id));
    }

    @Override
    public UserViewDTO create(UserCreateDTO userCreateDTO) {
        if (userRepository.findByEmail(userCreateDTO.email()).isPresent()) {
            throw new ValidationException("User with this email already exists.");
        }
        if (!userCreateDTO.password().equals(userCreateDTO.passwordConfirm())) {
            throw new ValidationException("Passwords don't match!");
        }

        User user = userMapper.create(userCreateDTO);
        user.setPassword(passwordEncoder.encode(userCreateDTO.password()));

        return userMapper.toDTO(user);
    }
}
