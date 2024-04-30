package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.ParticipationViewDTO;
import com.jshimas.karmaapi.entities.Participation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ParticipationMapper {
    @Mapping(target = "activityId", source = "activity.id")
    @Mapping(target = "activityName", source = "activity.name")
    @Mapping(target = "startOfActivity", source = "activity.startDate")
    @Mapping(target = "endOfActivity", source = "activity.endDate")
    @Mapping(target = "organizationId", source = "activity.organization.id")
    @Mapping(target = "organizationName", source = "activity.organization.name")
    @Mapping(target = "userId", source = "volunteer.id")
    @Mapping(target = "firstName", source = "volunteer.firstName")
    @Mapping(target = "lastName", source = "volunteer.lastName")
    @Mapping(target = "email", source = "volunteer.email")
    ParticipationViewDTO toDTO(Participation participation);
}
