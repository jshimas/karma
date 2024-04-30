package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.services.ActivityService;
import com.jshimas.karmaapi.services.ApplicationService;
import com.jshimas.karmaapi.services.AuthTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;
    private final AuthTokenService tokenService;

    @GetMapping("/activities")
    public List<ActivityNoFeedbackDTO> getAllActivities(@RequestParam(value = "search", required = false) String query,
                                                        @RequestParam(value = "scopes", required = false) List<String> scopes,
                                                        @RequestParam(value = "distance", required = false) Integer distance,
                                                        @RequestParam(value = "from", required = false) Instant from,
                                                        @RequestParam(value = "to", required = false) Instant to,
                                                        @AuthenticationPrincipal Jwt token) {

        UUID userId = token != null ? tokenService.extractId(token) : null;
        return activityService.findAllActivities(query, scopes, distance, from, to, userId);
    }

    @GetMapping("/organizations/{organizationId}/activities/{activityId}")
    public ActivityViewDTO getActivityById(@PathVariable("activityId") UUID activityId) {
        return activityService.findById(activityId);
    }

    @Secured({UserRole.ORGANIZER, UserRole.ADMIN})
    @PostMapping("/organizations/{organizationId}/activities")
    public ResponseEntity<ActivityNoFeedbackDTO> createOrganizationActivity(@PathVariable("organizationId") UUID organizationId,
                                                                            @Valid @RequestBody ActivityEditDTO activityEditDTO,
                                                                            @AuthenticationPrincipal Jwt token) {
        ActivityNoFeedbackDTO createdActivity = activityService.create(activityEditDTO, organizationId, token);

        URI location = URI.create(("/api/v1/activities/" + createdActivity.id()));

        return ResponseEntity.created(location).body(createdActivity);
    }

    @Secured({UserRole.ORGANIZER, UserRole.ADMIN})
    @PutMapping("/organizations/{organizationId}/activities/{activityId}")
    public ActivityViewDTO updateOrganizationActivity(@PathVariable("activityId") UUID activityId,
                                                      @RequestBody ActivityEditDTO activityEditDTO,
                                                      @AuthenticationPrincipal Jwt token) {

        return activityService.update(activityId, activityEditDTO, token);
    }

    @Secured({UserRole.ADMIN, UserRole.ORGANIZER})
    @DeleteMapping("/organizations/{organizationId}/activities/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganizationActivity(@PathVariable("activityId") UUID activityId,
                                           @AuthenticationPrincipal Jwt token) {
        activityService.deleteById(activityId, token);
    }

    @Secured({UserRole.ORGANIZER})
    @PutMapping("/organizations/{organizationId}/activities/{activityId}/resolve")
    public void resolveActivity(@Valid @RequestBody ResolveActivityRequest request,
                                           @PathVariable("activityId") UUID activityId){
        activityService.resolve(activityId, request.volunteerEarnings());
    }
}
