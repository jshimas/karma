package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.ApplicationViewDTO;
import com.jshimas.karmaapi.entities.Application;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {
    Application findEntity(UUID id);
    UUID create(String motivation, UUID userId, UUID activityId);
    void update(UUID id, boolean isApproved);
    List<ApplicationViewDTO> findAllApplications(UUID activityId);
    List<ApplicationViewDTO> findUserApplications(UUID userId);
}
