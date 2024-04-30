package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.entities.AccountType;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.GoogleService;
import com.jshimas.karmaapi.services.UserService;
import com.jshimas.karmaapi.services.impl.GmailEmailService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
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
    private final GmailEmailService emailService;

    private final String SIGNUP_GOOGLE_URL = "http://localhost:5173/signup-google";
    private final String LOGIN_GOOGLE_URL = "http://localhost:5173/login";

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            AccessTokenResponse tokens = authService.login(authRequest);

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, tokens.accessToken())
                    .body(tokens);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/send-organizer-invitation")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendRegistrationEmail(@RequestBody @Valid SendOrganizerInvitationRequest emailRequest,
                                      @AuthenticationPrincipal Jwt currentUserJwt) {
        User user = userService.findEntity(tokenService.extractId(currentUserJwt));
        String registrationToken = tokenService.generateRegistrationToken(user.getOrganization());
        emailService.sendRegistrationEmail(emailRequest, registrationToken);
    }

    @GetMapping("/validate-registration-token")
    public ValidationResponse validateRegistrationToken(@RequestParam("token") String token) {
        return tokenService.validateRegistrationToken(token);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutUser(@AuthenticationPrincipal Jwt currentUserJwt) {
        authService.logout(currentUserJwt);
    }

    @GetMapping("/oauth2/google/signup-url")
    public ResponseEntity<OAuth2RedirectUrl> oauthSignupUrl(@RequestParam(value = "token", required = false) String token) {
        tokenService.validateRegistrationToken(token);
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
    public ResponseEntity<AccessTokenResponse> createGoogleUser(@RequestBody @Valid GoogleSignupDTO googleSignupDTO,
                                                                @RequestParam("code") String code) {
        String token = googleSignupDTO.token();
        ValidationResponse validationResponse = tokenService.validateRegistrationToken(token);

        if (!validationResponse.valid()) {
            throw new ValidationException(validationResponse.message());
        }

        GoogleAccountData accountData = googleService.getAccountData(code, SIGNUP_GOOGLE_URL);

        UserViewDTO createdUser;
        if (token != null && !token.isBlank()) {
            Organization organization = tokenService.getOrganizationFromRegistrationToken(token);
            UserCreateDTO userCreateOrganizerDTO = new UserCreateDTO(
                    accountData.firstName(),
                    accountData.lastName(),
                    accountData.email(),
                    UserRole.ORGANIZER,
                    accountData.imageUrl()
            );
            createdUser = userService.create(userCreateOrganizerDTO, AccountType.GOOGLE, organization);
        } else {
            createdUser = userService.create(new UserCreateDTO(
                    accountData.firstName(),
                    accountData.lastName(),
                    accountData.email(),
                    googleSignupDTO.role(),
                    googleSignupDTO.bio(),
                    googleSignupDTO.scopes(),
                    googleSignupDTO.geoLocations(),
                    accountData.imageUrl()),
                    AccountType.GOOGLE, null);
        }

        tokenService.deleteRegistrationToken(token);

        URI location = URI.create("/users/" + createdUser.id());

        String accessToken = tokenService.generateAccessToken(createdUser.id());

        return ResponseEntity.created(location)
                .header(HttpHeaders.AUTHORIZATION, accessToken)
                .body(new AccessTokenResponse(accessToken));
    }

    @PostMapping("/oauth2/google/login")
    public ResponseEntity<AccessTokenResponse> loginGoogleUser(@RequestParam("code") String code) {
        GoogleAccountData accountData = googleService.getAccountData(code, LOGIN_GOOGLE_URL);

        UserViewDTO user = userService.findByEmail(accountData.email());

        String accessToken = tokenService.generateAccessToken(user.id());

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, accessToken)
                .body(new AccessTokenResponse(accessToken));
    }
}
