package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public Event findById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(Event.class, id));
    }
}
