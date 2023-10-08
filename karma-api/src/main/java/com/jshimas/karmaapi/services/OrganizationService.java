package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.OrganizationEditDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationNoEventsDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationViewDTO;
import com.jshimas.karmaapi.entities.Organization;

import java.util.List;
import java.util.UUID;

public interface OrganizationService {
    OrganizationNoEventsDTO create(OrganizationEditDTO organizationDTO);
    OrganizationViewDTO findById(UUID id);
    Organization findEntityById(UUID id);
    List<OrganizationNoEventsDTO> findAll();
    void deleteById(UUID id);
    OrganizationViewDTO update(UUID id, OrganizationEditDTO organizationDTO);
}
