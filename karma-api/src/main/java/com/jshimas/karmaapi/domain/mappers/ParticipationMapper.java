package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.ParticipationViewDTO;
import com.jshimas.karmaapi.entities.Participation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ParticipationMapper {
    @Mapping(target = "applicationId", source = "application.id")
    @Mapping(target = "organizerId", source = "organizer.id")
    ParticipationViewDTO toDTO(Participation participation);
}
