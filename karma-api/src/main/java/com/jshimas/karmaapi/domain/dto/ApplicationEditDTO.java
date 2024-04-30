package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotNull;

public record ApplicationEditDTO(
        @NotNull boolean isApproved
) {
}
