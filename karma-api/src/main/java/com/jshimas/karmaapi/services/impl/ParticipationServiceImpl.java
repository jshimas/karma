package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.ParticipationViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.ParticipationMapper;
import com.jshimas.karmaapi.entities.Application;
import com.jshimas.karmaapi.entities.Participation;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.ParticipationRepository;
import com.jshimas.karmaapi.services.ApplicationService;
import com.jshimas.karmaapi.services.ParticipationService;
import com.jshimas.karmaapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
class ParticipationServiceImpl implements ParticipationService {
    private final ParticipationRepository participationRepository;
    private final ApplicationService applicationService;
    private final UserService userService;
    private final ParticipationMapper participationMapper;

    @Override
    public Participation findEntity(UUID id) {
        return participationRepository.findById(id).orElseThrow(
                () -> new NotFoundException(Participation.class, id)
        );
    }

    @Override
    public UUID create(UUID applicationId) {
        Application application = applicationService.findEntity(applicationId);

        Participation participation = Participation.builder()
                .application(application)
                .build();

        return participationRepository.save(participation).getId();
    }

    @Override
    public void update(UUID id, boolean isConfirmed) {
        Participation participation = findEntity(id);
        participation.setConfirmed(isConfirmed);
        participationRepository.save(participation);
    }

    @Override
    public List<ParticipationViewDTO> findUserParticipations(UUID userId) {
        return participationRepository.findAllByUserId(userId).stream()
                .map(participationMapper::toDTO)
                .toList();
    }

    @Override
    public List<ParticipationViewDTO> findActivityParticipations(UUID activityId) {
        return participationRepository.findByApplicationId(activityId).stream()
                .map(participationMapper::toDTO)
                .toList();
    }
}
