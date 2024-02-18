package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.entities.AccountType;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.GoogleService;
import com.jshimas.karmaapi.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthService authService;
    private final GoogleService googleService;
    private final UserService userService;
    private final AuthTokenService tokenService;

    private final String SIGNUP_GOOGLE_URL = "http://localhost:5173/signup-google";
    private final String LOGIN_GOOGLE_URL = "http://localhost:5173/login";

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<LoginResponseTokens> login(@Valid @RequestBody AuthRequest authRequest) {
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

    @GetMapping("/oauth2/google/signup-url")
    public ResponseEntity<OAuth2RedirectUrl> oauthSignupUrl() {
        String authUrl = googleService.generateAuthorizationCodeRequestUrl(SIGNUP_GOOGLE_URL);
        return ResponseEntity.ok(new OAuth2RedirectUrl(authUrl));
    }

    @GetMapping("/oauth2/google/login-url")
    public ResponseEntity<OAuth2RedirectUrl> oauthLoginUrl() {
        String authUrl = googleService.generateAuthorizationCodeRequestUrl(LOGIN_GOOGLE_URL);
        return ResponseEntity.ok(new OAuth2RedirectUrl(authUrl));
    }

    @PostMapping("/oauth2/google/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AccessTokenResponse> createGoogleUser(@RequestBody @Valid GoogleSignupDTO googleSignupDTO, @RequestParam("code") String code) {
        GoogleAccountData accountData = googleService.getAccountData(code, SIGNUP_GOOGLE_URL);

        UserViewDTO createdUser = userService.create(new UserCreateDTO(
                        accountData.firstName(),
                        accountData.lastName(),
                        accountData.email(),
                        googleSignupDTO.role(),
                        accountData.imageUrl()),
                AccountType.GOOGLE);

        URI location = URI.create("/users/" + createdUser.id());

        String accessToken = tokenService.generateAccessToken(createdUser.id());

        return ResponseEntity.created(location)
                .header(HttpHeaders.AUTHORIZATION, accessToken)
                .body(new AccessTokenResponse(accessToken));
    }

    @PostMapping("/oauth2/google/login")
    public ResponseEntity<AccessTokenResponse> loginGoogleUser(@RequestParam("code") String code) {
        System.out.println("code: " + code);
        GoogleAccountData accountData = googleService.getAccountData(code, LOGIN_GOOGLE_URL);

        UserViewDTO user = userService.findByEmail(accountData.email());

        String accessToken = tokenService.generateAccessToken(user.id());

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, accessToken)
                .body(new AccessTokenResponse(accessToken));
    }
}
