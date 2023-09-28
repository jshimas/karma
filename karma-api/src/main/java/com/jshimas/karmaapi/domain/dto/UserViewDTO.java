package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserViewDTO(
        @NotNull UUID id,
        @NotNull @NotBlank String firstName,
        @NotNull @NotBlank String lastName,
        @NotNull @NotBlank @Email String email,
        @NotNull @NotBlank String role
) {
}
