package com.jshimas.karmaapi.domain.dto;

import com.jshimas.karmaapi.entities.Event;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public record OrganizationDTO(
        UUID id,
        @NotNull @NotBlank String name,
        @NotNull @Email String email,
        @NotNull @NotBlank String phone,
        @NotNull @NotBlank String type,
        String mission,
        String address,
        String website,
        String facebook,
        String instagram,
        String youtube,
        String linkedIn,
        List<Event> events,

        Timestamp createdAt,
        Timestamp updatedAt
) {
}
