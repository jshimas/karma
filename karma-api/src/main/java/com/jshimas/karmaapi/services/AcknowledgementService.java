package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.CreateAcknowledgementRequest;
import com.jshimas.karmaapi.entities.Acknowledgement;

import java.util.List;
import java.util.UUID;

public interface AcknowledgementService {
    void createAcknowledgementForUsers(UUID organizationId, UUID activityId, CreateAcknowledgementRequest request);
}
