package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.OrganizationDTO;
import com.jshimas.karmaapi.entities.Organization;

import java.util.List;
import java.util.UUID;

public interface OrganizationService {
    OrganizationDTO create(OrganizationDTO organizationDTO);
    OrganizationDTO findById(UUID id);
    Organization findEntityById(UUID id);
    List<OrganizationDTO> findAll();
    void deleteById(UUID id);
    OrganizationDTO update(UUID id, OrganizationDTO organizationDTO);
}
