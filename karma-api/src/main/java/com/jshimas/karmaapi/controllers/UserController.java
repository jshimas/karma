package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.dto.ValidationResponse;
import com.jshimas.karmaapi.entities.AccountType;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthTokenService tokenService;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createUser(@RequestBody @Valid UserCreateDTO userCreateDTO,
                                        @RequestParam(value = "token", required = false) String token) {
        ValidationResponse validationResponse = tokenService.validateRegistrationToken(token);

        if (!validationResponse.valid()) {
            throw new ValidationException(validationResponse.message());
        }

        UserViewDTO createdUser;
        if (token != null && !token.isBlank()) {
            Organization organization = tokenService.getOrganizationFromRegistrationToken(token);
            UserCreateDTO userCreateOrganizerDTO = new UserCreateDTO(
                    userCreateDTO.firstName(),
                    userCreateDTO.lastName(),
                    userCreateDTO.email(),
                    UserRole.ORGANIZER,
                    userCreateDTO.password(),
                    userCreateDTO.passwordConfirm()
            );
            createdUser = userService.create(userCreateOrganizerDTO, AccountType.EMAIL, organization);
        } else {
            createdUser = userService.create(userCreateDTO, AccountType.EMAIL, null);
        }

        tokenService.deleteRegistrationToken(token);

        URI location = URI.create("/users/" + createdUser.id());

        return ResponseEntity.created(location).build();
    }

    @GetMapping("/me")
    public UserViewDTO getAuthenticatedUser(@AuthenticationPrincipal Jwt token) {
        return userService.getUserInfo(tokenService.extractId(token));
    }

    @PutMapping("/me")
    public void updateUser(@AuthenticationPrincipal Jwt token,
                           @RequestBody @Valid UserEditDTO userEditDTO) {
        userService.update(tokenService.extractId(token), userEditDTO);
    }
}
