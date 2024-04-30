package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record VolunteerEarning(
        @NotNull UUID volunteerId,
        Integer hours,
        Integer minutes
) {
}
