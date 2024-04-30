package com.jshimas.karmaapi.domain.dto;

public record PrizeViewDTO(
    String id,
    String name,
    String description,
    String instructions,
    Integer quantity,
    Integer redeemedCount,
    Integer price,
    String organizationId,
    String organizationName
) {
}
