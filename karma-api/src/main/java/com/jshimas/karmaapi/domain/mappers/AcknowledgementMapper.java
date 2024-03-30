package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.AcknowledgementViewDTO;
import com.jshimas.karmaapi.entities.Acknowledgement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AcknowledgementMapper {
    @Mapping(target = "activityId", source = "participation.application.activity.id")
    @Mapping(target = "activityName", source = "participation.application.activity.name")
    @Mapping(target = "organizationId", source = "organizer.organization.id")
    @Mapping(target = "organizationName", source = "organizer.organization.name")
    AcknowledgementViewDTO toDTO(Acknowledgement acknowledgement);
}
