package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.ValidationResponse;
import com.jshimas.karmaapi.entities.*;
import com.jshimas.karmaapi.repositories.RegistrationTokenRepository;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.joining;

@Service
@RequiredArgsConstructor
public class AuthTokenServiceImpl implements AuthTokenService {
    private final UserService userService;
    private final JwtEncoder jwtEncoder;
    private final RegistrationTokenRepository registrationTokenRepository;

    @Value("${jwt.expiration.access}")
    private long accessExpirationMs;

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
    public String generateRegistrationToken(Organization organization) {
        RegistrationToken registrationToken = RegistrationToken.builder()
                .validUntil(Instant.now().plusSeconds(60 * 60 * 24 * 7)) // 1 week
                .organization(organization)
                .build();

        RegistrationToken createdToken = registrationTokenRepository.save(registrationToken);
        return createdToken.getToken().toString();
    }

    @Override
    public ValidationResponse validateRegistrationToken(String registrationToken) {
        if (registrationToken == null)
            return new ValidationResponse(true, null);

        Optional<RegistrationToken> token = registrationTokenRepository.findById(UUID.fromString(registrationToken));

        if (token.isEmpty())
            return new ValidationResponse(false, "Registration token is not valid" );

        if (token.get().getValidUntil().compareTo(Instant.now()) < 0) {
            deleteRegistrationToken(token.get().getToken().toString());
            return new ValidationResponse(false, "Registration token is expired");
        }

        return new ValidationResponse(true, null);
    }

    @Override
    @Transactional
    public void deleteRegistrationToken(String token) {
        if (token == null ) return;
        registrationTokenRepository.deleteById(UUID.fromString(token));
    }

    @Override
    public Organization getOrganizationFromRegistrationToken(String token) {
        if (token == null ) return null;

        RegistrationToken registrationToken = registrationTokenRepository.findById(UUID.fromString(token))
                .orElseThrow(() -> new ValidationException("Registration token is not valid"));

        return registrationToken.getOrganization();
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
