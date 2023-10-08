package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.security.SecurityUser;

import java.util.UUID;

public interface AuthTokenService {
    String generateAccessToken(UUID userId);
    String generateRefreshToken(UUID userId);
    String updateAccessToken(String refreshToken);
    void deleteRefreshToken(UUID userId);
}
