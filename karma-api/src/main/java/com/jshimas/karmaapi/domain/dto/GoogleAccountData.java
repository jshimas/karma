package com.jshimas.karmaapi.domain.dto;

public record GoogleAccountData(
        String firstName,
        String lastName,
        String imageUrl,
        String email
) {
}
