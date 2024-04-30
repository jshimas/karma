package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.ApplicationViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.ApplicationMapper;
import com.jshimas.karmaapi.entities.Activity;
import com.jshimas.karmaapi.entities.Application;
import com.jshimas.karmaapi.entities.ParticipationType;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.ApplicationRepository;
import com.jshimas.karmaapi.services.ActivityService;
import com.jshimas.karmaapi.services.ApplicationService;
import com.jshimas.karmaapi.services.ParticipationService;
import com.jshimas.karmaapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final UserService userService;
    private final ActivityService activityService;
    private final ApplicationMapper applicationMapper;
    private final ParticipationService participationService;

    @Override
    public Application findEntity(UUID id) {
        return applicationRepository.findById(id).orElseThrow(
                () -> new NotFoundException(Application.class, id)
        );
    }

    @Override
    public UUID create(String motivation, UUID userId, UUID activityId) {
        User user = userService.findEntity(userId);
        Activity activity = activityService.findEntity(activityId);

        Application application = Application.builder()
                .motivation(motivation)
                .volunteer(user)
                .activity(activity)
                .build();

        return applicationRepository.save(application).getId();
    }

    @Override
    public void update(UUID id, boolean isApproved) {
        Application application = findEntity(id);
        application.setIsApproved(isApproved);
        application.setDateOfApproval(Instant.now());
        applicationRepository.save(application);

        if (isApproved) {
            participationService.create(
                    application.getActivity().getId(),
                    application.getVolunteer().getId(),
                    ParticipationType.Application);
        }
    }

    @Override
    public List<ApplicationViewDTO> findAllApplications(UUID activityId) {
        return applicationRepository.findAllByActivityId(activityId).stream()
                .map(applicationMapper::toDTO)
                .toList();
    }

    @Override
    public List<ApplicationViewDTO> findUserApplications(UUID userId) {
        User user = userService.findEntity(userId);

        return user.getApplications().stream()
                .map(applicationMapper::toDTO)
                .toList();
    }
}
