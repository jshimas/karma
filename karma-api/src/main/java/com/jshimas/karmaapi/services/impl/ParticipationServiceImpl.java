package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.ParticipationEditDTO;
import com.jshimas.karmaapi.domain.dto.ParticipationViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.ParticipationMapper;
import com.jshimas.karmaapi.entities.*;
import com.jshimas.karmaapi.repositories.ApplicationRepository;
import com.jshimas.karmaapi.repositories.OrganizationRepository;
import com.jshimas.karmaapi.repositories.ParticipationRepository;
import com.jshimas.karmaapi.services.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
class ParticipationServiceImpl implements ParticipationService {
    private final ParticipationRepository participationRepository;
    private final ActivityService activityService;
    private final UserService userService;
    private final OrganizationService organizationService;
    private final ApplicationRepository applicationRepository;
    private final CertificationService certificationService;

    @Override
    public Participation findEntity(UUID id) {
        return participationRepository.findById(id).orElseThrow(
                () -> new NotFoundException(Participation.class, id)
        );
    }

    @Override
    @Transactional
    public UUID create(UUID activityId, UUID userId, ParticipationType participationType) {
        if (participationRepository.existsByActivityIdAndVolunteerId(activityId, userId)) {
            return null;
        }

        Activity activity = activityService.findEntity(activityId);
        User user = userService.findEntity(userId);
        Participation participation = Participation.builder()
                .activity(activity)
                .volunteer(user)
                .type(participationType)
                .build();
        participationRepository.save(participation);
        return participation.getId();
    }

    @Override
    public void createParticipations(UUID activityId, List<UUID> userIds) {
        Activity activity = activityService.findEntity(activityId);

        List<User> users = userIds.stream()
                .map(userService::findEntity)
                .toList();

        List<Participation> participations = users.stream()
                .filter(user -> !participationRepository.existsByActivityIdAndVolunteerId(activityId, user.getId()))
                .map(user -> Participation.builder()
                        .activity(activity)
                        .volunteer(user)
                        .type(ParticipationType.Invitation)
                        .build())
                .toList();

        participationRepository.saveAll(participations);
    }

    @Override
    public void update(ParticipationEditDTO participationEditDTO, UUID organizationId, UUID participationId, UUID userId) {
        Organization organization = organizationService.findEntityById(organizationId);

        if (participationEditDTO.cancelPartnership()) {
            // 1) delete all awaiting participations(invitations) from the organization for the user
            List<Participation> participations = organization.getActivities().stream()
                    .flatMap(activity -> activity.getParticipations().stream())
                    .filter(participation -> participation.getVolunteer().getId().equals(userId) && participation.getDateOfConfirmation() == null)
                    .collect(Collectors.toList());
            participationRepository.deleteAll(participations);

            // 2) invalidate all applications from the user for the organization
            List<Application> invalidatedApplications = organization.getActivities().stream()
                    .flatMap(activity -> activity.getApplications().stream())
                    .filter(application -> application.getVolunteer().getId().equals(userId))
                    .peek(application -> application.setValid(false))
                    .toList();
            applicationRepository.saveAll(invalidatedApplications);

            return;
        }

        Participation participation = findEntity(participationId);
        participation.setIsConfirmed(participationEditDTO.isConfirmed());
        participation.setDateOfConfirmation(Instant.now());
        participationRepository.save(participation);
    }

    @Override
    public String getCertificateLink(UUID participationId) {
        Participation participation = findEntity(participationId);
        return certificationService.generateCertificate(participation);
    }
}
