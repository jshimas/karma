package com.jshimas.karmaapi.domain.dto;

public record PrizeEditDTO(
    String name,
    String description,
    String instructions,
    Integer quantity,
    int price
) {
}
