package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.exceptions.ForbiddenAccessException;
import com.jshimas.karmaapi.domain.mappers.FeedbackMapper;
import com.jshimas.karmaapi.entities.Activity;
import com.jshimas.karmaapi.entities.Feedback;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.FeedbackRepository;
import com.jshimas.karmaapi.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final ActivityService activityService;
    private final AuthTokenService tokenService;
    private final FeedbackMapper feedbackMapper;
    private final FeedbackRepository feedbackRepository;
    private final UserService userService;

    @Override
    public FeedbackViewDTO create(FeedbackEditDTO feedbackDTO,
                                  UUID activityId,
                                  UUID organizationId,
                                  UUID userId) {

        Activity activity = activityService.findEntity(activityId);

        User user = userService.findEntity(userId);

        return feedbackMapper.toDTO(
                feedbackRepository.save(feedbackMapper.create(feedbackDTO, activity, user)));
    }

    @Override
    public FeedbackViewDTO findFeedback(UUID feedbackId, UUID activityId, UUID organizationId) {
        return feedbackMapper.toDTO(findEntity(feedbackId, activityId, organizationId));
    }

    @Override
    public Feedback findEntity(UUID feedbackId, UUID activityId, UUID organizationId) {
        Activity activity = activityService.findEntity(activityId);

        return feedbackRepository.findByIdAndActivityId(feedbackId, activity.getId())
                .orElseThrow(() -> new NotFoundException(
                        "Feedback not found with ID: " + feedbackId +
                                " in Activity with ID: " + activityId));
    }

    @Override
    public List<FeedbackViewDTO> findAllOrganizationActivityFeedbacks(UUID activityId, UUID organizationId) {
        Activity activity = activityService.findEntity(activityId);

        return activity.getFeedbacks().stream()
                .map(feedbackMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID feedbackId, UUID activityId, UUID organizationId, Jwt token) {
        Feedback feedback = findEntity(feedbackId, activityId, organizationId);

        boolean userIsAuthor = feedback.getUser().getId().equals(tokenService.extractId(token));

        if (!userIsAuthor && tokenService.isAdmin(token)) {
            throw new ForbiddenAccessException();
        }

        feedbackRepository.delete(feedback);
    }

    @Override
    public FeedbackViewDTO update(UUID feedbackId, UUID activityId, UUID organizationId,
                                  FeedbackEditDTO feedbackDTO, Jwt token) {
        Feedback feedback = findEntity(feedbackId, activityId, organizationId);

        boolean userIsAuthor = feedback.getUser().getId().equals(tokenService.extractId(token));

        if (!userIsAuthor) {
            throw new ForbiddenAccessException();
        }

        feedbackMapper.updateEntityFromDTO(feedbackDTO, feedback);
        Feedback updatedFeedback = feedbackRepository.save(feedback);

        return feedbackMapper.toDTO(updatedFeedback);
    }
}
