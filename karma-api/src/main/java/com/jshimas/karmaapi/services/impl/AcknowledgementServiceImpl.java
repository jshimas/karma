package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.CreateAcknowledgementRequest;
import com.jshimas.karmaapi.entities.Acknowledgement;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.repositories.AcknowledgementRepository;
import com.jshimas.karmaapi.repositories.ParticipationRepository;
import com.jshimas.karmaapi.services.AcknowledgementService;
import com.jshimas.karmaapi.services.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AcknowledgementServiceImpl implements AcknowledgementService {
    private final OrganizationService organizationService;
    private final ParticipationRepository participationRepository;
    private final AcknowledgementRepository acknowledgementRepository;

    @Override
    public void createAcknowledgementForUsers(UUID organizationId, UUID activityId, CreateAcknowledgementRequest request) {
        Organization organization = organizationService.findEntityById(organizationId);

        List<Acknowledgement> acknowledgements = request.userIds().stream()
                .map(userId -> participationRepository.findByActivityIdAndVolunteerId(activityId, userId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(participation -> Acknowledgement.builder()
                        .organization(organization)
                        .participation(participation)
                        .text(request.text())
                        .build()
                ).toList();

        acknowledgementRepository.saveAll(acknowledgements);
    }
}
