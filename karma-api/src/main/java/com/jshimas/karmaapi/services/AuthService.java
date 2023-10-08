package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface AuthService {
    LoginResponseTokens login(AuthRequest authRequest);
    void logout(Jwt currentUserJwt);
    AccessTokenResponse updateAccessToken(RefreshTokenRequest refreshTokenRequest);
    UserViewDTO getCurrentUser(Jwt token);
    boolean isAdmin(Jwt token);
    UUID extractId(Jwt token);
}
