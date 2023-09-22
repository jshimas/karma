package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.EventEditDTO;
import com.jshimas.karmaapi.domain.dto.EventViewDTO;
import com.jshimas.karmaapi.entities.Event;
import org.mapstruct.*;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        uses = {FeedbackMapper.class, GeoPointMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {
    @Mapping(target = "organizationId", source = "organization.id")
    public EventViewDTO toViewDTO(Event event);

    public Event toEntity(EventEditDTO eventEditDTO);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    public void updateEntityFromDTO(EventEditDTO eventEditDTO, @MappingTarget Event event);
}
