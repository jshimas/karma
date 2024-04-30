package com.jshimas.karmaapi.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record ParticipationViewDTO(
    @NotNull UUID id,
    @NotNull UUID activityId,
    @NotNull String activityName,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    @NotNull Instant startOfActivity,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    @NotNull Instant endOfActivity,
    @NotNull UUID organizationId,
    @NotNull String organizationName,
    @NotNull UUID userId,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull String email,
    Boolean isConfirmed,
    Integer karmaPoints,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    @NotNull Instant dateOfInvitation,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    Instant dateOfConfirmation,
    String type
) {
}
