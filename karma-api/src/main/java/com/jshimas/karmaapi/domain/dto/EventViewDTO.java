package com.jshimas.karmaapi.domain.dto;

import com.jshimas.karmaapi.entities.Feedback;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EventViewDTO(
        UUID id,
        String organizationId,
        @NotNull @NotBlank String name,
        @NotNull Instant startDate,
        @NotNull @NotBlank String description,
        @NotNull @NotBlank String duration,
        @NotNull @NotBlank String location,
        GeoPointDTO geoLocation,
        List<Feedback> feedbacks,

        Timestamp createdAt,
        Timestamp updatedAt
) {

}
