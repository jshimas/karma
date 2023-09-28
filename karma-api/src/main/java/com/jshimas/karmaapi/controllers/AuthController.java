package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.security.AuthRequest;
import com.jshimas.karmaapi.security.SecurityUser;
import com.jshimas.karmaapi.security.Token;
import com.jshimas.karmaapi.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;

import static java.util.stream.Collectors.joining;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?>login(@RequestBody @Valid AuthRequest authRequest) {
        try {
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
                            .issuer("pcparts.com")
                            .issuedAt(now)
                            .expiresAt(now.plusSeconds(expiry))
                            .subject(secUser.getId().toString())
                            .claim("role", role)
                            .build();

            var token = this.jwtEncoder
                    .encode(JwtEncoderParameters.from(
                            JwsHeader.with(MacAlgorithm.HS256).build(),
                            claims))
                    .getTokenValue();

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .body(new Token(token));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> register(@RequestBody @Valid UserCreateDTO userCreateDTO) {
        UserViewDTO createdUser = userService.create(userCreateDTO);

        URI location = URI.create("/users/" + createdUser.id());

        return ResponseEntity.created(location).build();
    }
}
