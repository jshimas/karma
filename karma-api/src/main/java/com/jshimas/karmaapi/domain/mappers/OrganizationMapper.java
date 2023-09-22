package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.OrganizationDTO;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.OrganizationType;
import org.mapstruct.*;
import org.springframework.util.StringUtils;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        uses = {EventMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class OrganizationMapper {
    public abstract OrganizationDTO toDTO(Organization organization);
    @Mapping(target = "type", source = "type", qualifiedByName = "stringToOrganizationType")
    public abstract Organization toEntity(OrganizationDTO organizationDTO);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    @Mapping(target = "type", source = "type", qualifiedByName = "stringToOrganizationType")
    public abstract void updateEntityFromDTO(OrganizationDTO organizationDTO, @MappingTarget Organization organization);

    @Named("stringToOrganizationType")
    protected OrganizationType stringToOrganizationType(String type) {
        if (StringUtils.hasText(type)) {
            return OrganizationType.valueOf(type);
        } else return OrganizationType.other;
    }
}
