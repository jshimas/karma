package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

    @PostMapping()
    public ResponseEntity<EventNoFeedbackDTO> createOrganizationEvent(@PathVariable("organizationId") UUID organizationId,
                                                     @Valid @RequestBody EventEditDTO eventEditDTO) {
        EventNoFeedbackDTO createdEvent = eventService.create(eventEditDTO, organizationId);

        URI location = URI.create(
                String.format("/api/v1/organizations/%s/events/%s", organizationId, createdEvent.id()));

        return ResponseEntity.created(location).body(createdEvent);
    }

    @PutMapping("/{eventId}")
    public EventViewDTO updateOrganizationEvent(@PathVariable("organizationId") UUID organizationId,
                                        @PathVariable("eventId") UUID eventId,
                                        @RequestBody EventEditDTO eventEditDTO) {
        return eventService.update(eventId, organizationId, eventEditDTO);
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganizationEvent(@PathVariable("organizationId") UUID organizationId,
                                        @PathVariable("eventId") UUID eventId) {
        eventService.deleteById(eventId, organizationId);
    }
}
