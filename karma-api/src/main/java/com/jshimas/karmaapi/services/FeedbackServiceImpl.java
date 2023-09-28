package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.FeedbackMapper;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Feedback;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final EventService eventService;
    private final UserService userService;
    private final FeedbackMapper feedbackMapper;
    private final FeedbackRepository feedbackRepository;

    @Override
    public FeedbackViewDTO create(FeedbackEditDTO feedbackDTO,
                                  UUID eventId,
                                  UUID organizationId,
                                  UUID userId) {

        Event event = eventService.findEntity(eventId, organizationId);

        // TODO: Use authenticated user when authentication is implemented
        // User user = userService.findEntity(userId);
        User user = User.builder()
                .id(userId)
                .firstName("John")
                .lastName("Brown")
                .email("mail@demo.com")
                .password("pass")
                .feedbacks(new ArrayList<>())
                .build();

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
    public void delete(UUID feedbackId, UUID eventId, UUID organizationId) {
        feedbackRepository.delete(findEntity(feedbackId, eventId, organizationId));
    }

    @Override
    public FeedbackViewDTO update(UUID feedbackId, UUID eventId, UUID organizationId,
                                  FeedbackEditDTO feedbackDTO) {
        Feedback feedback = findEntity(feedbackId, eventId, organizationId);

        feedbackMapper.updateEntityFromDTO(feedbackDTO, feedback);
        Feedback updatedFeedback = feedbackRepository.save(feedback);

        return feedbackMapper.toDTO(updatedFeedback);
    }
}
