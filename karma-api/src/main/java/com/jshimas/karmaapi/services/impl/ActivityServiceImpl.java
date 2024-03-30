package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.ActivityEditDTO;
import com.jshimas.karmaapi.domain.dto.ActivityNoFeedbackDTO;
import com.jshimas.karmaapi.domain.dto.ActivityViewDTO;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.exceptions.ForbiddenAccessException;
import com.jshimas.karmaapi.domain.mappers.ActivityMapper;
import com.jshimas.karmaapi.entities.*;
import com.jshimas.karmaapi.repositories.ActivityRepository;
import com.jshimas.karmaapi.repositories.ScopeRepository;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.ActivityService;
import com.jshimas.karmaapi.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.locationtech.jts.geom.Point;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {
    private final ActivityRepository activityRepository;
    private final ScopeRepository scopeRepository;
    private final ActivityMapper activityMapper;
    private final AuthTokenService tokenService;
    private final UserService userService;

    @Override
    public ActivityNoFeedbackDTO create(ActivityEditDTO activityDTO, UUID organizationId, Jwt token) {
        User organizer = userService.findEntity(tokenService.extractId(token));

        boolean userIsOrganizer = organizer.getOrganization().getId().equals(organizationId);

        if (!userIsOrganizer && !tokenService.isAdmin(token)) {
            throw new ForbiddenAccessException(
                    "User is not an organizer of the organization with ID: " + organizationId);
        }

        Activity createdActivity = activityRepository.save(
                activityMapper.create(activityDTO, organizer.getOrganization()));

        List<String> newScopes = activityDTO.scopes().stream()
                .filter(scope -> !scopeRepository.existsByName(scope)).toList();

        // Add newly created scopes to the activity
        newScopes.forEach(scope -> {
            Scope newScope = Scope.builder()
                    .name(scope)
                    .activities(new HashSet<>(List.of(createdActivity)))
                    .build();

            createdActivity.getScopes().add(newScope);
            scopeRepository.save(newScope);
        });

        // Add existing scopes to the event
        activityDTO.scopes().forEach(scope -> {
            if (!newScopes.contains(scope)) {
                Scope existantScope = scopeRepository.findByName(scope)
                        .orElseThrow(() -> new NotFoundException("Scope not found with name: " + scope));

                existantScope.getActivities().add(createdActivity);
                scopeRepository.save(existantScope);

                createdActivity.getScopes().add(existantScope);
            }
        });

        activityRepository.save(createdActivity);

        return activityMapper.toViewWithoutFeedbacksDTO(createdActivity);
    }

    @Override
    public ActivityViewDTO findById(UUID activityId) {
        return activityMapper.toViewDTO(findEntity(activityId));
    }

    @Override
    public Activity findEntity(UUID activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> new NotFoundException(
                        "Activity not found with ID: " + activityId));
    }

    public List<ActivityNoFeedbackDTO> findAllActivities(String query, List<String> scopes, Integer distance, Instant from, Instant to, UUID userId) {
        User user = userService.findEntity(userId);

        List<Point> userLocations = user.getLocations().stream()
                .map(UserLocation::getLocation)
                .toList();

        return activityRepository.findAll().stream()
                .filter(activity -> filterByQuery(activity, query))
                .filter(activity -> filterByScopes(activity, scopes))
                .filter(activity -> filterByDistance(activity, userLocations, distance))
                .filter(activity -> filterByStartDate(activity, from))
                .filter(activity -> filterByEndDate(activity, to))
                .map(activityMapper::toViewWithoutFeedbacksDTO)
                .collect(Collectors.toList());
    }

    private boolean filterByDistance(Activity activity, List<Point> userLocations, Integer maxDistanceInMeters) {
        if (activity.getGeoLocation() == null || userLocations.isEmpty() || maxDistanceInMeters == null) {
            return true;
        }

        for (Point userLocation : userLocations) {
            return activityRepository.arePointsWithin(
                    String.valueOf(userLocation.getX()), String.valueOf(userLocation.getY()),
                    String.valueOf(activity.getGeoLocation().getX()), String.valueOf(activity.getGeoLocation().getY()),
                    maxDistanceInMeters
            );

        }
        return false;
    }

    private boolean filterByQuery(Activity activity, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }

        return StringUtils.containsIgnoreCase(activity.getName(), query)
                || StringUtils.containsIgnoreCase(activity.getDescription(), query);
    }

    private boolean filterByScopes(Activity activity, List<String> scopes) {
        if (scopes == null || scopes.isEmpty()) {
            return true;
        }

        Set<String> activityScopeNames = activity.getScopes().stream()
                .map(Scope::getName)
                .collect(Collectors.toSet());

        return activityScopeNames.stream().anyMatch(scopes::contains);
    }

    private boolean filterByStartDate(Activity activity, Instant from) {
        if (from == null) {
            return true;
        }

        return activity.getStartDate().isAfter(from);
    }

    private boolean filterByEndDate(Activity activity, Instant to) {
        if (to == null) {
            return true;
        }

        return activity.getEndDate().isBefore(to);
    }

    @Override
    public void deleteById(UUID activityId, Jwt token) {
        Activity activity = findEntity(activityId);

        checkIfUserIsActivityOrganizer(activity, token);

        activityRepository.delete(activity);
    }

    @Override
    public ActivityViewDTO update(UUID activityId, ActivityEditDTO activityDTO, Jwt token) {
        Activity entity = findEntity(activityId);

        checkIfUserIsActivityOrganizer(entity, token);

        activityMapper.updateEntityFromDTO(activityDTO, entity);
        Activity updatedActivity = activityRepository.save(entity);

        return activityMapper.toViewDTO(updatedActivity);
    }

    private void checkIfUserIsActivityOrganizer(Activity activity, Jwt token) {
        User organizer = userService.findEntity(tokenService.extractId(token));

        boolean userIsOrganizer = activity.getOrganization().getId()
                .equals(organizer.getOrganization().getId());

        if (!userIsOrganizer && !tokenService.isAdmin(token)) {
            throw new ForbiddenAccessException(
                    "User is not an organizer of the organization with ID: " + organizer.getOrganization().getId());
        }
    }
}
