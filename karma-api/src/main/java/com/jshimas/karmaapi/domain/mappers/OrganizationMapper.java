package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.OrganizationEditDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationNoActivitiesDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationViewDTO;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.OrganizationType;
import com.jshimas.karmaapi.repositories.OrganizationTypeRepository;
import jakarta.validation.ValidationException;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        uses = {ActivityMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class OrganizationMapper {
    @Autowired
    private OrganizationTypeRepository organizationTypeRepository;

    @Mapping(target = "type", source = "type", qualifiedByName = "organizationTypeToString")
    public abstract OrganizationViewDTO toDTO(Organization organization);

    @Mapping(target = "type", source = "type", qualifiedByName = "organizationTypeToString")
    public abstract OrganizationNoActivitiesDTO toNoActivitiesDTO(Organization organization);

    @Mapping(target = "type", source = "type", qualifiedByName = "stringToOrganizationType")
    public abstract Organization toEntity(OrganizationEditDTO organizationDTO);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    @Mapping(target = "type", source = "type", qualifiedByName = "stringToOrganizationType")
    public abstract void updateEntityFromDTO(OrganizationEditDTO organizationDTO, @MappingTarget Organization organization);

    @Named("stringToOrganizationType")
    protected OrganizationType stringToOrganizationType(String type) {
        return organizationTypeRepository.findByTypeNameIgnoreCase(type)
                .orElseThrow(() -> new ValidationException(
                        String.format("Organization type %s is not valid", type)));
    }

    @Named("organizationTypeToString")
    protected String organizationTypeToString(OrganizationType type) {
        return type.getTypeName().toLowerCase();
    }
}
