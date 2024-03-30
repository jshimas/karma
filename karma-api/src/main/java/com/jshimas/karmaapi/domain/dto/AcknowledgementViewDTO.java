package com.jshimas.karmaapi.domain.dto;

public record AcknowledgementViewDTO(
        String id,
        String activityId,
        String activityName,
        String organizationId,
        String organizationName,
        String text
) {
}
