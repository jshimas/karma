package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.ParticipationEditDTO;
import com.jshimas.karmaapi.entities.Participation;
import com.jshimas.karmaapi.entities.ParticipationType;

import java.util.List;
import java.util.UUID;

public interface ParticipationService {
    Participation findEntity(UUID id);
    UUID create(UUID activityId, UUID userId, ParticipationType participationType);
    void createParticipations(UUID activityId, List<UUID> userIds);
    void update(ParticipationEditDTO participationEditDTO, UUID organizationId, UUID participationId, UUID userId);
    String getCertificateLink(UUID participationId);
}
