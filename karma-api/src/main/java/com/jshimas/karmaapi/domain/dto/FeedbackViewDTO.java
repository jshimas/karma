package com.jshimas.karmaapi.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record FeedbackViewDTO(
        @NotNull @NotBlank UUID id,
        @NotNull @NotBlank UUID userId,
        @NotNull @NotBlank String firstName,
        @NotNull @NotBlank String lastName,
        @NotNull @NotBlank UUID activityId,
        @NotNull Integer rating,
        String comment,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
        @NotNull Instant updatedAt
) {
}
