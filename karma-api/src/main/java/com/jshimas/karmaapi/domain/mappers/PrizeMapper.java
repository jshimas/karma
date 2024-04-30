package com.jshimas.karmaapi.domain.mappers;

import com.jshimas.karmaapi.domain.dto.PrizeEditDTO;
import com.jshimas.karmaapi.domain.dto.PrizeViewDTO;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.Prize;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface PrizeMapper {
    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "organizationName", source = "organization.name")
    @Mapping(target = "redeemedCount", expression = "java(prize.getRedeemedBy().size())")
    PrizeViewDTO toDTO(Prize prize);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "dto.name")
    Prize create(PrizeEditDTO dto, Organization organization);

    @BeanMapping(nullValueCheckStrategy = ALWAYS, nullValuePropertyMappingStrategy = IGNORE)
    Prize updateEntityFromDTO(PrizeEditDTO dto, @MappingTarget Prize prize);
}
