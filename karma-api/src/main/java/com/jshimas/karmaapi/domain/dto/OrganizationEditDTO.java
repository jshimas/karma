package com.jshimas.karmaapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.sql.Timestamp;

public record OrganizationEditDTO(
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
        String linkedin,

        Timestamp createdAt,
        Timestamp updatedAt
) {
}
