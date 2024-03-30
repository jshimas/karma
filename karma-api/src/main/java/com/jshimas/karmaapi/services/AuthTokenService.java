package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.ValidationResponse;
import com.jshimas.karmaapi.entities.Organization;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface AuthTokenService {
    String generateAccessToken(UUID userId);
    String generateRefreshToken(UUID userId);
    String updateAccessToken(String refreshToken);
    void deleteRefreshToken(UUID userId);
    String generateRegistrationToken(Organization organization);
    ValidationResponse validateRegistrationToken(String token);
    void deleteRegistrationToken(String token);
    Organization getOrganizationFromRegistrationToken(String token);
    boolean isAdmin(Jwt token);
    UUID extractId(Jwt token);
}
