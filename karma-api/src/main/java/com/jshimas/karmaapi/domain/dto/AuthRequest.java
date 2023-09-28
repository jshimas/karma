package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record AuthRequest(
        @NotNull @Email String email,
        @NotNull String password
) {
}
