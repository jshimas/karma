package com.jshimas.karmaapi.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record ParticipationViewDTO(
    @NotNull UUID id,
    @NotNull UUID applicationId,
    @NotNull UUID organizerId,
    boolean isConfirmed,
    Integer hoursWorked,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    @NotNull Instant dateOfInvitation,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    Instant dateOfConfirmation
) {
}
