package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.Set;

public record ActivityEditDTO(
        @NotNull @NotBlank String name,
        @NotNull Instant startDate,
        @NotNull Instant endDate,
        @NotNull @NotBlank String description,
        @NotNull @NotBlank String address,
        @NotNull Boolean isPublic,
        @NotNull Boolean resolved,
        @NotNull Integer volunteersNeeded,
        Set<String> scopes,
        GeoPointDTO geoLocation
) {
}
