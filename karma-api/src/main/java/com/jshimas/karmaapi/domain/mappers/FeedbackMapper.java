package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.FeedbackEditDTO;
import com.jshimas.karmaapi.domain.dto.FeedbackViewDTO;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Feedback;
import com.jshimas.karmaapi.entities.User;
import org.mapstruct.*;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FeedbackMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "eventId", source = "event.id")
    public FeedbackViewDTO toDTO(Feedback feedback);

    @Mapping(target = "id", source = "feedbackDTO.id")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "event", source = "event")
    public Feedback create(FeedbackEditDTO feedbackDTO, Event event, User user);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    public void updateEntityFromDTO(FeedbackEditDTO feedbackEditDTO, @MappingTarget Feedback feedback);
}