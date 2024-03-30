package com.jshimas.karmaapi.domain.dto;

import java.util.UUID;

public record UserLocationDTO(
        UUID id,
        String name,
        GeoPointDTO location,
        String address
) {
}
