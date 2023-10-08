package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations/{organizationId}/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping("/{eventId}")
    public EventViewDTO getEventById(@PathVariable("organizationId") UUID organizationId,
                                     @PathVariable("eventId") UUID eventId) {
        return eventService.findById(eventId, organizationId);
    }

    @GetMapping()
    public List<EventNoFeedbackDTO> getOrganizationEvents(@PathVariable("organizationId") UUID organizationId) {
        return eventService.findAllOrganizationEvents(organizationId);
    }

    @Secured({UserRole.ORGANIZER})
    @PostMapping()
    public ResponseEntity<EventNoFeedbackDTO> createOrganizationEvent(@PathVariable("organizationId") UUID organizationId,
                                                     @Valid @RequestBody EventEditDTO eventEditDTO,
                                                     @AuthenticationPrincipal Jwt token) {
        EventNoFeedbackDTO createdEvent = eventService.create(eventEditDTO, organizationId, token);

        URI location = URI.create(
                String.format("/api/v1/organizations/%s/events/%s", organizationId, createdEvent.id()));

        return ResponseEntity.created(location).body(createdEvent);
    }

    @Secured({UserRole.ORGANIZER})
    @PutMapping("/{eventId}")
    public EventViewDTO updateOrganizationEvent(@PathVariable("organizationId") UUID organizationId,
                                        @PathVariable("eventId") UUID eventId,
                                        @RequestBody EventEditDTO eventEditDTO,
                                        @AuthenticationPrincipal Jwt token) {

        return eventService.update(eventId, organizationId, eventEditDTO, token);
    }

    @Secured({UserRole.ADMIN, UserRole.ORGANIZER})
    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganizationEvent(@PathVariable("organizationId") UUID organizationId,
                                        @PathVariable("eventId") UUID eventId,
                                        @AuthenticationPrincipal Jwt token) {
        eventService.deleteById(eventId, organizationId, token);
    }
}
