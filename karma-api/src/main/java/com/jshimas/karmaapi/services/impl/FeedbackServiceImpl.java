package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.exceptions.ForbiddenAccessException;
import com.jshimas.karmaapi.domain.mappers.FeedbackMapper;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Feedback;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.FeedbackRepository;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.EventService;
import com.jshimas.karmaapi.services.FeedbackService;
import com.jshimas.karmaapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final EventService eventService;
    private final AuthService authService;
    private final FeedbackMapper feedbackMapper;
    private final FeedbackRepository feedbackRepository;
    private final UserService userService;

    @Override
    public FeedbackViewDTO create(FeedbackEditDTO feedbackDTO,
                                  UUID eventId,
                                  UUID organizationId,
                                  UUID userId) {

        Event event = eventService.findEntity(eventId, organizationId);

        User user = userService.findEntity(userId);

        return feedbackMapper.toDTO(
                feedbackRepository.save(feedbackMapper.create(feedbackDTO, event, user)));
    }

    @Override
    public FeedbackViewDTO findFeedback(UUID feedbackId, UUID eventId, UUID organizationId) {
        return feedbackMapper.toDTO(findEntity(feedbackId, eventId, organizationId));
    }

    @Override
    public Feedback findEntity(UUID feedbackId, UUID eventId, UUID organizationId) {
        Event event = eventService.findEntity(eventId, organizationId);

        return feedbackRepository.findByIdAndEventId(feedbackId, event.getId())
                .orElseThrow(() -> new NotFoundException(
                        "Feedback not found with ID: " + feedbackId +
                                " in Event with ID: " + eventId));
    }

    @Override
    public List<FeedbackViewDTO> findAllOrganizationEventFeedbacks(UUID eventId, UUID organizationId) {
        Event event = eventService.findEntity(eventId, organizationId);

        return event.getFeedbacks().stream()
                .map(feedbackMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID feedbackId, UUID eventId, UUID organizationId, Jwt token) {
        Feedback feedback = findEntity(feedbackId, eventId, organizationId);

        boolean userIsAuthor = feedback.getUser().getId().equals(authService.extractId(token));

        if (!userIsAuthor && authService.isAdmin(token)) {
            throw new ForbiddenAccessException();
        }

        feedbackRepository.delete(feedback);
    }

    @Override
    public FeedbackViewDTO update(UUID feedbackId, UUID eventId, UUID organizationId,
                                  FeedbackEditDTO feedbackDTO, Jwt token) {
        Feedback feedback = findEntity(feedbackId, eventId, organizationId);

        boolean userIsAuthor = feedback.getUser().getId().equals(authService.extractId(token));

        if (!userIsAuthor) {
            throw new ForbiddenAccessException();
        }

        feedbackMapper.updateEntityFromDTO(feedbackDTO, feedback);
        Feedback updatedFeedback = feedbackRepository.save(feedback);

        return feedbackMapper.toDTO(updatedFeedback);
    }
}
