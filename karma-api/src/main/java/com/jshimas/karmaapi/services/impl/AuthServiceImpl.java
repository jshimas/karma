package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.security.SecurityUser;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static java.util.stream.Collectors.joining;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthTokenService tokenService;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponseTokens login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.email(), authRequest.password()));

        SecurityUser secUser = (SecurityUser) authentication.getPrincipal();

        String accessToken = tokenService.generateAccessToken(secUser.getId());
        String refreshToken = tokenService.generateRefreshToken(secUser.getId());

        return new LoginResponseTokens(accessToken, refreshToken);
    }

    @Override
    public AccessTokenResponse updateAccessToken(RefreshTokenRequest refreshTokenRequest) {
        return new AccessTokenResponse(tokenService.updateAccessToken(refreshTokenRequest.refreshToken()));
    }


    @Override
    public void logout(Jwt currentUserJwt) {
        UUID userId = tokenService.extractId(currentUserJwt);
        tokenService.deleteRefreshToken(userId);
    }
}
