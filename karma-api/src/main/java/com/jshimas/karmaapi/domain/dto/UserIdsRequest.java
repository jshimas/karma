package com.jshimas.karmaapi.domain.dto;

import java.util.List;
import java.util.UUID;

public record UserIdsRequest(
        List<UUID> userIds
) {
}
