package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.exceptions.UnauthorizedAccessException;
import com.jshimas.karmaapi.domain.mappers.EventMapper;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.repositories.EventRepository;
import com.jshimas.karmaapi.services.AuthService;
import com.jshimas.karmaapi.services.EventService;
import com.jshimas.karmaapi.services.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final OrganizationService organizationService;
    private final AuthService authService;

    @Override
    public EventViewDTO create(EventEditDTO eventDTO, UUID organizationId, Jwt token) {
        Organization existantOrganization = organizationService.findEntityById(organizationId);

        boolean userIsOrganizer = existantOrganization.getOrganizers().stream()
                .anyMatch(organizer -> organizer.getUser().getId().equals(authService.extractId(token)));

        if (!userIsOrganizer) {
            throw new UnauthorizedAccessException();
        }

        Event createdEvent = eventRepository.save(
                eventMapper.create(eventDTO, existantOrganization));

        return eventMapper.toViewDTO(createdEvent);
    }

    @Override
    public EventViewDTO findById(UUID eventId, UUID organizationId) {
        return eventMapper.toViewDTO(findEntity(eventId, organizationId));
    }

    @Override
    public Event findEntity(UUID eventId, UUID organizationId) {
        Organization existantOrganization = organizationService.findEntityById(organizationId);

        return eventRepository.findByIdAndOrganizationId(eventId, existantOrganization.getId())
                .orElseThrow(() -> new NotFoundException(
                        "Event not found with ID: " + eventId +
                                " in Organization with ID: " + organizationId));
    }

    @Override
    public List<EventNoFeedbackDTO> findAllOrganizationEvents(UUID organizationId) {
        Organization existantOrganization = organizationService.findEntityById(organizationId);

        return existantOrganization.getEvents().stream()
                .map(eventMapper::toViewWithoutFeedbacksDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID eventId, UUID organizationId, Jwt token) {
        Event entity = findEntity(eventId, organizationId);

        boolean userIsOrganizer = entity.getOrganization().getOrganizers().stream()
                .anyMatch(organizer -> organizer.getUser().getId().equals(authService.extractId(token)));

        if (!userIsOrganizer && !authService.isAdmin(token)) {
            throw new UnauthorizedAccessException();
        }

        eventRepository.delete(entity);
    }

    @Override
    public EventViewDTO update(UUID eventId, UUID organizationId, EventEditDTO eventDTO, Jwt token) {
        Event existantEvent = findEntity(eventId, organizationId);

        boolean userIsOrganizer = existantEvent.getOrganization().getOrganizers().stream()
                .anyMatch(organizer -> organizer.getUser().getId().equals(authService.extractId(token)));

        if (!userIsOrganizer) {
            throw new UnauthorizedAccessException();
        }

        eventMapper.updateEntityFromDTO(eventDTO, existantEvent);
        Event updatedEvent = eventRepository.save(existantEvent);

        return eventMapper.toViewDTO(updatedEvent);
    }
}
