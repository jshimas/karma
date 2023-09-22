package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record EventEditDTO(
        @NotNull @NotBlank String name,
        @NotNull Instant startDate,
        @NotNull @NotBlank String description,
        @NotNull @NotBlank String duration,
        @NotNull @NotBlank String location,
        GeoPointDTO geoLocation
) {
}
