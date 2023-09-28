package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.UserCreateDTO;
import com.jshimas.karmaapi.domain.dto.UserEditDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.services.UserService;
import jakarta.validation.Valid;
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
    private final UserDetailsService userDetailsService;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createUser(@RequestBody @Valid UserCreateDTO userCreateDTO) {
        UserViewDTO createdUser = userService.create(userCreateDTO);

        URI location = URI.create("/users/" + createdUser.id());

        return ResponseEntity.created(location).build();
    }

    @GetMapping("/me")
    public UserViewDTO getAuthenticatedUser(@AuthenticationPrincipal Jwt token) {
        return userService.getCurrentUser(token);
    }

    @Secured({UserRole.ADMIN})
    @PutMapping("/{userId}")
    public void updateUser(@PathVariable UUID userId,
                           @RequestBody @Valid UserEditDTO userEditDTO) {
        userService.update(userId, userEditDTO);
    }
}
