package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.ParticipationViewDTO;
import com.jshimas.karmaapi.entities.Participation;

import java.util.List;
import java.util.UUID;

public interface ParticipationService {
    Participation findEntity(UUID id);
    UUID create(UUID applicationId);
    void update(UUID id, boolean isConfirmed);
    List<ParticipationViewDTO> findUserParticipations(UUID userId);
    List<ParticipationViewDTO> findActivityParticipations(UUID activityId);
}
