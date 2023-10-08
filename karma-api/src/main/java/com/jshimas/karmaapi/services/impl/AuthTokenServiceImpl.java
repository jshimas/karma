package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.RefreshToken;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.RefreshTokenRepository;
import com.jshimas.karmaapi.security.SecurityUser;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.UserService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

import static java.util.stream.Collectors.joining;

@Service
@RequiredArgsConstructor
public class AuthTokenServiceImpl implements AuthTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    @Value("${jwt.expiration.access}")
    private int accessExpirationMs;

    @Value("${jwt.expiration.refresh}")
    private long refreshExpirationMs;

    @Override
    public String generateAccessToken(UUID userId) {
        User user = userService.findEntity(userId);

        Instant now = Instant.now();
        Instant expiryDate = now.plusMillis(accessExpirationMs);

        var claims =
                JwtClaimsSet.builder()
                        .issuer("karma.com")
                        .issuedAt(now)
                        .expiresAt(expiryDate)
                        .subject(user.getId().toString())
                        .claim("role", user.getRole())
                        .build();

        return jwtEncoder.encode(
                        JwtEncoderParameters.from(
                                JwsHeader.with(MacAlgorithm.HS256).type("JWT").build(),
                                claims))
                .getTokenValue();
    }

    @Override
    public String generateRefreshToken(UUID userId) {
        User user = userService.findEntity(userId);
        Instant expiryDate = Instant.now().plusMillis(refreshExpirationMs);
        String token = UUID.randomUUID().toString();
        String encodedToken = passwordEncoder.encode(token);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .expiryDate(expiryDate)
                .token(encodedToken)
                .build();

        refreshTokenRepository.save(refreshToken);

        return token;
    }

    @Override
    public String updateAccessToken(String refreshToken) {
        RefreshToken rt = refreshTokenRepository.findByToken(passwordEncoder.encode(refreshToken))
                .orElseThrow(() -> new NotFoundException(
                        String.format("Refresh token: %s is not valid", refreshToken)));

        if (rt.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(rt);
            throw new ValidationException("Refresh token is expired. Please log in");
        }

        return generateAccessToken(rt.getUser().getId());
    }

    public void deleteRefreshToken(UUID userId) {
        refreshTokenRepository.deleteByUser(userService.findEntity(userId));
    }
}
