package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.ApplicationEditDTO;
import com.jshimas.karmaapi.domain.dto.ApplicationViewDTO;
import com.jshimas.karmaapi.domain.dto.CreateApplicationRequest;
import com.jshimas.karmaapi.services.ApplicationService;
import com.jshimas.karmaapi.services.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/organizations/{organizationId}/activities/{activityId}/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final AuthTokenService tokenService;

    @PostMapping()
    public ResponseEntity<Void> applyToActivity(@PathVariable("organizationId") UUID organizationId,
                                                @PathVariable("activityId") UUID activityId,
                                                @RequestBody CreateApplicationRequest applicationRequest,
                                                @AuthenticationPrincipal Jwt token) {

        UUID userId = tokenService.extractId(token);
        UUID applicationId = applicationService.create(applicationRequest.motivation(), userId, activityId);

        URI location = URI.create(String.format(
                "/api/v1/organizations/%s/activities/%s/applications/%s", organizationId, activityId, applicationId));

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{applicationId}")
    public void updateApplication(@PathVariable("applicationId") UUID applicationId,
                                  @RequestBody ApplicationEditDTO applicationEditDTO) {
        applicationService.update(applicationId, applicationEditDTO.isApproved());
    }

    @GetMapping()
    public List<ApplicationViewDTO> getAllApplications(@RequestParam("activityId") UUID activityId) {
        return applicationService.findAllApplications(activityId);
    }
}
