package com.jshimas.karmaapi.domain.dto;

import java.util.List;
import java.util.UUID;

public record CreateAcknowledgementRequest(
        List<UUID> userIds,
        String text
) {
}
