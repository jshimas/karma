package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.GoogleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthService authService;
    private final GoogleService googleService;

    @CrossOrigin
    @PostMapping("/login/email")
    public ResponseEntity<LoginResponseTokens>login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            LoginResponseTokens tokens = authService.login(authRequest);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, tokens.accessToken())
                    .body(tokens);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh-token")
    public AccessTokenResponse updateAccessToken(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.updateAccessToken(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutUser(@AuthenticationPrincipal Jwt currentUserJwt) {
        authService.logout(currentUserJwt);
    }

    @GetMapping("/oauth2/google/me")
    public ResponseEntity<GoogleAccountData> exchangeOAuthCodeForUserData(@RequestParam("code") String code) {
        return ResponseEntity.ok(googleService.getAccountData(code));
    }

    @GetMapping("/oauth2/google/url")
    public ResponseEntity<OAuth2RedirectUrl> oauthUrl() {
        String authUrl = googleService.generateAuthorizationCodeRequestUrl();
        return ResponseEntity.ok(new OAuth2RedirectUrl(authUrl));
    }
}
