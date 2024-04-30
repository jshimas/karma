package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record UserCreateDTO(
        @NotNull @NotBlank String firstName,
        @NotNull @NotBlank String lastName,
        @NotNull @NotBlank @Email String email,
        @NotNull @NotBlank String role,
        String bio,
        List<String> scopes,
        List<UserLocationDTO> geoLocations,
        String imageUrl,
        @NotBlank String password,
        @NotBlank String passwordConfirm,
        String token
) {
    public UserCreateDTO(String firstName, String lastName, String email, String role, String bio, List<String> scopes, List<UserLocationDTO> geoLocations, String imageUrl) {
        this(firstName, lastName, email, role, bio, scopes, geoLocations, imageUrl, null, null, null);
    }

    public UserCreateDTO(String firstName, String lastName, String email, String role, String bio, List<String> scopes, List<UserLocationDTO> geoLocations, String password, String passwordConfirm) {
        this(firstName, lastName, email, role, bio, scopes, geoLocations, null, password, passwordConfirm, null);
    }

    public UserCreateDTO(String firstName, String lastName, String email, String role, String imageUrl) {
        this(firstName, lastName, email, role, null, null, null, imageUrl, null, null, null);
    }
}
