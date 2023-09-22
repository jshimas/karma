package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotNull;

public record GeoPointDTO(
        @NotNull double lat,
        @NotNull double lng
) {
}
