package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(User.class, id));
    }
}
