package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.AuthRequest;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.security.SecurityUser;
import com.jshimas.karmaapi.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

import static java.util.stream.Collectors.joining;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;

    @Override
    public String login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.email(), authRequest.password()));

        SecurityUser secUser = (SecurityUser) authentication.getPrincipal();

        Instant now = Instant.now();
        int expiry = 60 * 60 * 24; // 1 day

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(joining(""));

        var claims =
                JwtClaimsSet.builder()
                        .issuer("karma.com")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(expiry))
                        .subject(secUser.getId().toString())
                        .claim("role", role)
                        .build();

        return jwtEncoder.encode(
                JwtEncoderParameters.from(
                        JwsHeader.with(MacAlgorithm.HS256).type("JWT").build(),
                        claims))
                .getTokenValue();
    }

    @Override
    public boolean isAdmin(Jwt token) {
        return token.getClaimAsString("role").equalsIgnoreCase(UserRole.ADMIN);
    }

    @Override
    public UUID extractId(Jwt token) {
        return UUID.fromString(token.getSubject());
    }
}
