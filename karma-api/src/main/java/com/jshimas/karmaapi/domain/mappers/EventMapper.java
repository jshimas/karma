package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Organization;
import org.mapstruct.*;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        uses = {FeedbackMapper.class, GeoPointMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {
    @Mapping(target = "organizationId", source = "organization.id")
    EventViewDTO toViewDTO(Event event);

    @Mapping(target = "organizationId", source = "organization.id")
    EventNoFeedbackDTO toViewWithoutFeedbacksDTO(Event event);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "organization", source = "organization")
    @Mapping(target = "name", source = "eventEditDTO.name")
    Event create(EventEditDTO eventEditDTO, Organization organization);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    void updateEntityFromDTO(EventEditDTO eventEditDTO, @MappingTarget Event event);
}
