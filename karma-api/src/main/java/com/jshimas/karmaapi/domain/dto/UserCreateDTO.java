package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserCreateDTO(
        @NotNull @NotBlank String firstName,
        @NotNull @NotBlank String lastName,
        @NotNull @NotBlank @Email String email,
        @NotNull @NotBlank String role,
        String imageUrl,
        UUID organizationId,
        @NotBlank String password,
        @NotBlank String passwordConfirm
) {
    public UserCreateDTO(String firstName, String lastName, String email, String role, String imageUrl) {
        this(firstName, lastName, email, role, imageUrl, null, null, null);
    }
}
