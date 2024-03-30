package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record UserViewDTO(
        @NotNull UUID id,
        UUID organizationId,
        @NotNull @NotBlank String firstName,
        @NotNull @NotBlank String lastName,
        @NotNull @NotBlank @Email String email,
        @NotNull @NotBlank String role,
        String bio,
        String imageUrl,
        @NotNull Integer collectedHours,
        List<String> scopes,
        List<UserLocationDTO> geoLocations
//        List<AcknowledgementViewDTO> acknowledgements
) {
}
