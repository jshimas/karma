package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface UserService {
    User findEntity(UUID id);
    UserViewDTO findByEmail(String email);
    UserViewDTO create(UserCreateDTO userCreateDTO, String accountType, Organization organization);
    UserViewDTO update(UUID userId, UserEditDTO userEditDTO);
    void updateProfileImage(UUID userId, MultipartFile image);
    UserViewDTO getUserInfo(UUID userId);
}
