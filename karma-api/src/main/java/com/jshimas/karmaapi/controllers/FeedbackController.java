package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.services.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
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
    public ResponseEntity<?> createFeedback(
            @PathVariable UUID organizationId,
            @PathVariable UUID eventId,
            @Valid @RequestBody FeedbackEditDTO feedbackEditDTO,
            Principal principal) {

        UUID userId = UUID.fromString(principal.getName());

        FeedbackViewDTO createdFeedback = feedbackService.create(
                feedbackEditDTO, eventId, organizationId, userId);

        URI location = URI.create(
                String.format("/api/v1/organizations/%s/events/%s/feedbacks/%s",
                        organizationId, eventId, createdFeedback.id()));

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateFeedback(@PathVariable UUID organizationId,
                               @PathVariable UUID eventId,
                               @PathVariable UUID feedbackId,
                               @RequestBody FeedbackEditDTO feedbackEditDTO,
                               @AuthenticationPrincipal Jwt token) {

        feedbackService.update(feedbackId, eventId, organizationId, feedbackEditDTO, token);
    }

    @DeleteMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable UUID organizationId,
                                        @PathVariable UUID eventId,
                                        @PathVariable UUID feedbackId,
                                        @AuthenticationPrincipal Jwt token) {

        feedbackService.delete(feedbackId, eventId, organizationId, token);
    }
}
