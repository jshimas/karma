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
@RequestMapping("/api/v1/organizations/{organizationId}/activities/{activityId}/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @GetMapping("/{feedbackId}")
    public FeedbackViewDTO getFeedback(@PathVariable UUID organizationId,
                                        @PathVariable UUID activityId,
                                        @PathVariable UUID feedbackId) {

        return feedbackService.findFeedback(feedbackId, activityId, organizationId);
    }

    @GetMapping()
    public List<FeedbackViewDTO> getOrganizationActivityFeedbackList(
            @PathVariable UUID organizationId,
            @PathVariable UUID activityId) {

        return feedbackService.findAllOrganizationActivityFeedbacks(activityId, organizationId);
    }

    @PostMapping()
    public ResponseEntity<FeedbackViewDTO> createFeedback(
            @PathVariable UUID organizationId,
            @PathVariable UUID activityId,
            @Valid @RequestBody FeedbackEditDTO feedbackEditDTO,
            Principal principal) {

        UUID userId = UUID.fromString(principal.getName());

        FeedbackViewDTO createdFeedback = feedbackService.create(
                feedbackEditDTO, activityId, organizationId, userId);

        URI location = URI.create(
                String.format("/api/v1/organizations/%s/activities/%s/feedbacks/%s",
                        organizationId, activityId, createdFeedback.id()));

        return ResponseEntity.created(location).body(createdFeedback);
    }

    @PutMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public FeedbackViewDTO updateFeedback(@PathVariable UUID organizationId,
                               @PathVariable UUID activityId,
                               @PathVariable UUID feedbackId,
                               @RequestBody FeedbackEditDTO feedbackEditDTO,
                               @AuthenticationPrincipal Jwt token) {

        return feedbackService.update(feedbackId, activityId, organizationId, feedbackEditDTO, token);
    }

    @DeleteMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable UUID organizationId,
                                        @PathVariable UUID activityId,
                                        @PathVariable UUID feedbackId,
                                        @AuthenticationPrincipal Jwt token) {

        feedbackService.delete(feedbackId, activityId, organizationId, token);
    }
}
