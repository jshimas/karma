package com.jshimas.karmaapi.services;

import java.util.UUID;

public interface AuthTokenService {
    String generateAccessToken(UUID userId);
    String generateRefreshToken(UUID userId);
    String updateAccessToken(String refreshToken);
    void deleteRefreshToken(UUID userId);
}
