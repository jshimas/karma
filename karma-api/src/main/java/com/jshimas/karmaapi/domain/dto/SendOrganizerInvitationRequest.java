package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendOrganizerInvitationRequest(
        @NotNull @NotBlank String toEmail,
        @NotNull @NotBlank String fromName,
        @NotNull @NotBlank String fromEmail,
        @NotNull @NotBlank String organizationName
) {}
