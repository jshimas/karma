package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.ActivityEditDTO;
import com.jshimas.karmaapi.domain.dto.ActivityNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.ActivityViewDTO;
import com.jshimas.karmaapi.entities.Activity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ActivityService {
    ActivityNoFeedbackDTO create(ActivityEditDTO activityDTO, UUID organizationId, Jwt token);
    ActivityViewDTO findById(UUID activityId);
    Activity findEntity(UUID activityId);
    List<ActivityNoFeedbackDTO> findAllActivities(String query, List<String> scopes, Integer distance, Instant from, Instant to, UUID userId);
    void deleteById(UUID activityId, Jwt token);
    ActivityViewDTO update(UUID activityId, ActivityEditDTO activityDTO, Jwt token);
}
