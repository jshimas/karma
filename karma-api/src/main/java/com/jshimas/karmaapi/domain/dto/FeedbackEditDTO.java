package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FeedbackEditDTO(
        @NotNull Integer rating,
        String comment
) {
}
