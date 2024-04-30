package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.OrganizationEditDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationNoActivitiesDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationViewDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.entities.Organization;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface OrganizationService {
    OrganizationNoActivitiesDTO create(OrganizationEditDTO organizationDTO, UUID userId);
    OrganizationViewDTO findById(UUID id);
    Organization findEntityById(UUID id);
    List<OrganizationNoActivitiesDTO> findAll();
    void deleteById(UUID id);
    OrganizationViewDTO update(UUID id, OrganizationEditDTO organizationDTO, Jwt token);
    List<UserViewDTO> getOrganizationVolunteers(UUID organizationId, UUID activityId, List<String> scopes);
    void cancelPartnership(UUID organizationId, UUID userId);
}
