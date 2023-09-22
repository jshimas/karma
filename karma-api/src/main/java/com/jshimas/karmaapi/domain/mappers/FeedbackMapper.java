package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.FeedbackDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Feedback;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.EventRepository;
import com.jshimas.karmaapi.repositories.UserRepository;
import com.jshimas.karmaapi.services.EventService;
import com.jshimas.karmaapi.services.UserService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class FeedbackMapper {

    @Autowired private EventService eventService;
    @Autowired private UserService userService;

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "eventId", source = "event.id")
    public abstract FeedbackDTO toDTO(Feedback feedback);

    @Mapping(target = "user", source = "userId", qualifiedByName = "idToUser")
    @Mapping(target = "event", source = "eventId", qualifiedByName = "idToEvent")
    public abstract Feedback toEntity(FeedbackDTO feedbackDTO);

    @Named("idToUser")
    protected User idToUser(UUID id) {
        return userService.findById(id);
    }

    @Named("idToEvent")
    protected Event idToEvent(UUID id) {
        return eventService.findById(id);
    }
}