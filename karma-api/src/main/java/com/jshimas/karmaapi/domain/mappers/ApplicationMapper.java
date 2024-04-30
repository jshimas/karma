package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.ApplicationViewDTO;
import com.jshimas.karmaapi.entities.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationMapper {
    @Mapping(target = "userId", source = "volunteer.id")
    @Mapping(target = "firstName", source = "volunteer.firstName")
    @Mapping(target = "lastName", source = "volunteer.lastName")
    @Mapping(target = "email", source = "volunteer.email")
    @Mapping(target = "activityId", source = "activity.id")
    ApplicationViewDTO toDTO(Application application);
}
