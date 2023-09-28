package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.AuthRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface AuthService {
    String login(AuthRequest authRequest);
    boolean isAdmin(Jwt token);
    UUID extractId(Jwt token);
}
