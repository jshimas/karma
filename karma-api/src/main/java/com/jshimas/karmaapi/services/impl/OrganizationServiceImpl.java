package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.OrganizationEditDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationNoActivitiesDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationViewDTO;
import com.jshimas.karmaapi.domain.dto.UserViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.exceptions.ForbiddenAccessException;
import com.jshimas.karmaapi.domain.mappers.OrganizationMapper;
import com.jshimas.karmaapi.domain.mappers.UserMapper;
import com.jshimas.karmaapi.entities.*;
import com.jshimas.karmaapi.repositories.ApplicationRepository;
import com.jshimas.karmaapi.repositories.OrganizationRepository;
import com.jshimas.karmaapi.repositories.ParticipationRepository;
import com.jshimas.karmaapi.repositories.UserRepository;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.OrganizationService;
import com.jshimas.karmaapi.services.StorageService;
import com.jshimas.karmaapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final ApplicationRepository applicationRepository;
    private final ParticipationRepository participationRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final OrganizationMapper organizationMapper;
    private final AuthTokenService tokenService;
    private final UserMapper userMapper;
    private final StorageService storageService;

    @Override
    public OrganizationNoActivitiesDTO create(OrganizationEditDTO organizationDTO, UUID userId) {
        Organization organization = organizationMapper.toEntity(organizationDTO);
        setOrganizationImage(organization, organizationDTO.image());
        Organization createdOrganization = organizationRepository.save(organization);

        User organizer = userRepository.findById(userId).orElseThrow(() -> new NotFoundException(User.class, userId));
        organizer.setOrganization(createdOrganization);
        userRepository.save(organizer);

        createdOrganization.setOrganizers(List.of(organizer));

        return organizationMapper.toNoActivitiesDTO(createdOrganization);
    }

    @Override
    public OrganizationViewDTO findById(UUID id) {
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
    public List<OrganizationNoActivitiesDTO> findAll() {
        return organizationRepository.findAll().stream()
                .map(organizationMapper::toNoActivitiesDTO)
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
    public OrganizationViewDTO update(UUID id, OrganizationEditDTO organizationDTO, Jwt token) {
        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(Organization.class, id));

        boolean userIsOrganizer = existingOrganization.getOrganizers().stream()
                .anyMatch(organizer -> organizer.getId().equals(tokenService.extractId(token)));

        if (!userIsOrganizer && !tokenService.isAdmin(token)) {
            throw new ForbiddenAccessException();
        }

        organizationMapper.updateEntityFromDTO(organizationDTO, existingOrganization);

        setOrganizationImage(existingOrganization, organizationDTO.image());
        Organization updatedOrganization = organizationRepository.save(existingOrganization);

        return organizationMapper.toDTO(updatedOrganization);
    }

    private void setOrganizationImage(Organization organization, MultipartFile image) {
        if (image != null) {
            try {
                String imageUrl = storageService.saveImage(image, organization.getName() + "_logo");
                organization.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }
    }

    @Override
    public List<UserViewDTO> getOrganizationVolunteers(UUID organizationId, UUID activityId, List<String> scopes) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new NotFoundException(Organization.class, organizationId));

        return organization.getActivities().stream()
                .flatMap(activity -> activity.getApplications().stream())
                .filter(application -> filterByActivityId(application, activityId))
                .filter(application -> application.getIsApproved() != null && application.getIsApproved())
                .filter(Application::getValid)
                .map(Application::getVolunteer)
                .distinct()
                .filter(volunteer -> filterByScopes(volunteer, scopes))
                .map(volunteer -> userService.getUserInfo(volunteer.getId()))
                .toList();
    }

    @Override
    public void cancelPartnership(UUID organizationId, UUID userId) {
        // 1) delete all awaiting participations(invitations) from the organization for the user
        List<Participation> invitationsToDelete = participationRepository.findAllByVolunteerId(userId).stream()
                .filter(participation -> participation.getActivity().getOrganization().getId().equals(organizationId))
                .filter(participation -> participation.getDateOfConfirmation() == null)
                .toList();

        participationRepository.deleteAll(invitationsToDelete);

        // 2) invalidate all applications from the user for the organization
        List<Application> applicationsToIvalidade = applicationRepository.findAllByVolunteerId(userId).stream()
                .filter(application -> application.getActivity().getOrganization().getId().equals(organizationId))
                .peek(application -> application.setValid(false))
                .toList();

        applicationRepository.saveAll(applicationsToIvalidade);
    }

    private boolean filterByActivityId(Application application, UUID activityId) {
        return activityId == null || application.getActivity().getId().equals(activityId);
    }

    private boolean filterByScopes(User user, List<String> scopes) {
        if (scopes == null || scopes.isEmpty()) {
            return true;
        }

        Set<String> activityScopeNames = user.getScopes().stream()
                .map(Scope::getName)
                .collect(Collectors.toSet());

        return activityScopeNames.stream().anyMatch(scopes::contains);
    }
}
