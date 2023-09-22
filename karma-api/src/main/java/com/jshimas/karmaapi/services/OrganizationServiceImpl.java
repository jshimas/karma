package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.OrganizationDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.OrganizationMapper;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.repositories.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;

    @Override
    public OrganizationDTO create(OrganizationDTO organizationDTO) {
        Organization organization =
                organizationRepository.save(organizationMapper.toEntity(organizationDTO));

        return organizationMapper.toDTO(organization);
    }

    @Override
    public OrganizationDTO findById(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(Organization.class, id));

        return organizationMapper.toDTO(organization);
    }

    @Override
    public Organization findEntityById(UUID id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(Organization.class, id));
    }

    @Override
    public List<OrganizationDTO> findAll() {
        return organizationRepository.findAll().stream()
                .map(organizationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        if (!organizationRepository.existsById(id)) {
            throw new NotFoundException(Organization.class, id);
        }
        organizationRepository.deleteById(id);
    }

    @Override
    public OrganizationDTO update(UUID id, OrganizationDTO organizationDTO) {
        Organization exitantOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(Organization.class, id));

        organizationMapper.updateEntityFromDTO(organizationDTO, exitantOrganization);
        Organization updatedOrganization = organizationRepository.save(exitantOrganization);

        return organizationMapper.toDTO(updatedOrganization);
    }
}
