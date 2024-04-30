package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.AccessTokenResponse;
import com.jshimas.karmaapi.domain.dto.AuthRequest;
import com.jshimas.karmaapi.domain.dto.RefreshTokenRequest;
import com.jshimas.karmaapi.security.SecurityUser;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthTokenService tokenService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AccessTokenResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.email(), authRequest.password()));

        SecurityUser secUser = (SecurityUser) authentication.getPrincipal();

        String accessToken = tokenService.generateAccessToken(secUser.getId());

        return new AccessTokenResponse(accessToken);
    }


    @Override
    public void logout(Jwt currentUserJwt) {
        tokenService.extractId(currentUserJwt);
    }
}
