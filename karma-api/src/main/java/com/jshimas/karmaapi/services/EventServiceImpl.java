package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.EventMapper;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final OrganizationService organizationService;
    private final EventMapper eventMapper;

    @Override
    public EventViewDTO create(EventEditDTO eventDTO, UUID organizationId) {
        Organization existantOrganization = organizationService.findEntityById(organizationId);

        return eventMapper.toViewDTO(
                eventMapper.create(eventDTO, existantOrganization));
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
    public List<EventViewDTO> findAllOrganizationEvents(UUID organizationId) {
        Organization existantOrganization = organizationService.findEntityById(organizationId);

        return existantOrganization.getEvents().stream()
                .map(eventMapper::toViewDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID eventId, UUID organizationId) {
        eventRepository.delete(findEntity(eventId, organizationId));
    }

    @Override
    public EventViewDTO update(UUID eventId, UUID organizationId, EventEditDTO eventDTO) {
        Event existantEvent = findEntity(eventId, organizationId);

        eventMapper.updateEntityFromDTO(eventDTO, existantEvent);
        Event updatedEvent = eventRepository.save(existantEvent);

        return eventMapper.toViewDTO(updatedEvent);
    }
}
