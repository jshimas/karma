package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.services.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations/{organizationId}/events/{eventId}/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @GetMapping("/{feedbackId}")
    public FeedbackViewDTO getFeedback(@PathVariable UUID organizationId,
                                        @PathVariable UUID eventId,
                                        @PathVariable UUID feedbackId) {

        return feedbackService.findFeedback(feedbackId, eventId, organizationId);
    }

    @GetMapping()
    public List<FeedbackViewDTO> getOrganizationEventFeedbackList(
            @PathVariable UUID organizationId,
            @PathVariable UUID eventId) {

        return feedbackService.findAllOrganizationEventFeedbacks(eventId, organizationId);
    }

    @PostMapping()
    public ResponseEntity<FeedbackViewDTO> createOrganizationEventFeedback(
            @PathVariable UUID organizationId,
            @PathVariable UUID eventId,
            @Valid @RequestBody FeedbackEditDTO feedbackEditDTO) {

        //TODO: Update when authentication is implemented

        FeedbackViewDTO createdFeedback = feedbackService.create(
                feedbackEditDTO, eventId, organizationId, UUID.fromString("ee6c7f86-2db4-4df2-95f6-6a86bf1c8907"));

        URI location = URI.create(
                String.format("/api/v1/organizations/%s/events/%s/feedbacks/%s",
                        organizationId, eventId, createdFeedback.id()));

        return ResponseEntity.created(location).body(createdFeedback);
    }

    @PutMapping("/{feedbackId}")
    public FeedbackViewDTO updateOrganizationEventFeedback(@PathVariable UUID organizationId,
                                        @PathVariable UUID eventId,
                                        @PathVariable UUID feedbackId,
                                        @RequestBody FeedbackEditDTO feedbackEditDTO) {

        return feedbackService.update(feedbackId, eventId, organizationId, feedbackEditDTO);
    }

    @DeleteMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganizationEvent(@PathVariable UUID organizationId,
                                        @PathVariable UUID eventId,
                                        @PathVariable UUID feedbackId) {

        feedbackService.delete(feedbackId, eventId, organizationId);
    }
}
