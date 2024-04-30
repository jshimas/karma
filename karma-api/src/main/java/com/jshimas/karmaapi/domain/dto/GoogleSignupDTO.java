package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record GoogleSignupDTO(
        @NotNull @NotBlank String role,
        String bio,
        List<String> scopes,
        List<UserLocationDTO> geoLocations,
        String token
) {
}
