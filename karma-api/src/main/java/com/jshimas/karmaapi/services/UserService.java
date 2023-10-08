package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.entities.User;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface UserService {
    User findEntity(UUID id);
    UserViewDTO create(UserCreateDTO userCreateDTO);
    void update(UUID userId, UserEditDTO userEditDTO);
}
