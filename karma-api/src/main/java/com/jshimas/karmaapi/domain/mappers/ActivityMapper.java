package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.ActivityEditDTO;
import com.jshimas.karmaapi.domain.dto.ActivityNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.ActivityViewDTO;
import com.jshimas.karmaapi.entities.Activity;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.Scope;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        uses = {FeedbackMapper.class, GeoPointMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ActivityMapper {
    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "scopes", source = "scopes", qualifiedByName = "scopesToStrings")
    public abstract ActivityViewDTO toViewDTO(Activity activity);

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "scopes", source = "scopes", qualifiedByName = "scopesToStrings")
    public abstract ActivityNoFeedbackDTO toViewWithoutFeedbacksDTO(Activity activity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "organization", source = "organization", qualifiedByName = "mapOrganization")
    @Mapping(target = "name", source = "activityEditDTO.name")
    @Mapping(target = "address", source = "activityEditDTO.address")
    @Mapping(target = "scopes", ignore = true)
    public abstract Activity create(ActivityEditDTO activityEditDTO, Organization organization);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    @Mapping(target = "scopes", ignore = true)
    public abstract void updateEntityFromDTO(ActivityEditDTO activityEditDTO, @MappingTarget Activity activity);

    @Named("scopesToStrings")
    protected Set<String> scopesToStrings(Set<Scope> scopes) {
        return scopes.stream()
                .map(Scope::getName)
                .collect(Collectors.toSet());
    }

    @Named("mapOrganization")
    protected Organization mapOrganization(Organization organization) {
        return organization;
    }
}
