package com.jshimas.karmaapi.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EventNoFeedbackDTO(
        @NotNull @NotBlank UUID id,
        @NotNull @NotBlank String organizationId,
        @NotNull @NotBlank String name,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
        @NotNull Instant startDate,
        @NotNull @NotBlank String description,
        @NotNull @NotBlank String duration,
        @NotNull @NotBlank String location,
        GeoPointDTO geoLocation,

        Timestamp createdAt,
        Timestamp updatedAt
) {
}
