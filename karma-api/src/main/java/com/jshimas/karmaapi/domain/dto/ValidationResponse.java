package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotNull;

public record ValidationResponse(
        @NotNull boolean valid,
        String message
) {
}
