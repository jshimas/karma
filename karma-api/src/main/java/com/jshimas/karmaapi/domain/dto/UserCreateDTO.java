package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserCreateDTO(
        @NotNull @NotBlank String firstName,
        @NotNull @NotBlank String lastName,
        @NotNull @NotBlank @Email String email,
        @NotNull @NotBlank String role,
        @NotNull @NotBlank String password,
        @NotNull @NotBlank String passwordConfirm
) {
}
