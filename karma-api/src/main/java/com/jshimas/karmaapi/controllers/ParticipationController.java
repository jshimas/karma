package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.CertificationResponse;
import com.jshimas.karmaapi.domain.dto.UserIdsRequest;
import com.jshimas.karmaapi.domain.dto.ParticipationEditDTO;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.ParticipationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/organizations/{organizationId}/activities/{activityId}/participations")
public class ParticipationController {
    private final ParticipationService participationService;
    private final AuthTokenService tokenService;

    @PostMapping
    public void createParticipations(@PathVariable UUID organizationId,
                                     @PathVariable UUID activityId,
                                     @Valid @RequestBody UserIdsRequest request) {
        participationService.createParticipations(activityId, request.userIds());
    }

    @PutMapping("/{participationId}")
    public void updateParticipation(@PathVariable UUID organizationId,
                                    @PathVariable UUID activityId,
                                    @PathVariable UUID participationId,
                                    @RequestBody ParticipationEditDTO participationEditDTO,
                                    @AuthenticationPrincipal Jwt token) {
        UUID userId = tokenService.extractId(token);
        participationService.update(participationEditDTO, organizationId, participationId, userId);
    }

    @GetMapping("/{participationId}/certificate")
    public CertificationResponse getCertification(@PathVariable UUID participationId) {
        String certLink = participationService.getCertificateLink(participationId);
        return new CertificationResponse(certLink);
    }
}
