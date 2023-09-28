package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.entities.Feedback;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

public interface FeedbackService {
    FeedbackViewDTO create(FeedbackEditDTO feedbackDTO, UUID eventId, UUID organizationId, UUID userId);
    FeedbackViewDTO findFeedback(UUID feedbackId, UUID eventId, UUID organizationId);
    Feedback findEntity(UUID feedbackId, UUID eventId, UUID organizationId);
    List<FeedbackViewDTO> findAllOrganizationEventFeedbacks(UUID eventId, UUID organizationId);
    void delete(UUID feedbackId, UUID eventId, UUID organizationId, Jwt token);
    FeedbackViewDTO update(UUID feedbackId, UUID eventId, UUID organizationId, FeedbackEditDTO feedbackDTO, Jwt token);
}
