package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.entities.User;

import java.util.UUID;

public interface UserService {
    User findEntity(UUID id);

    UserViewDTO create(UserCreateDTO userCreateDTO);
}
