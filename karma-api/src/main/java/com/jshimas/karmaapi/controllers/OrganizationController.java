package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.*;
import com.jshimas.karmaapi.entities.UserRole;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {
    private final OrganizationService organizationService;
    private final AuthTokenService tokenService;

    @GetMapping("/{id}")
    public OrganizationViewDTO getOrganizationById(@PathVariable UUID id) {
        return organizationService.findById(id);
    }

    @GetMapping()
    public List<OrganizationNoActivitiesDTO> getAllOrganizations() {
        return organizationService.findAll();
    }

    @Secured({UserRole.ORGANIZER})
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<OrganizationNoActivitiesDTO> createOrganization(@Valid @ModelAttribute OrganizationEditDTO organizationDTO,
                                                                          @AuthenticationPrincipal Jwt token) {
        UUID userId = tokenService.extractId(token);
        OrganizationNoActivitiesDTO createdOrganization = organizationService.create(organizationDTO, userId);

        URI location = URI.create("/api/v1/organizations/" + createdOrganization.id());

        return ResponseEntity.created(location).body(createdOrganization);
    }

    @Secured({UserRole.ADMIN, UserRole.ORGANIZER})
    @PutMapping(value ="/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public OrganizationViewDTO updateOrganization(@PathVariable("id") UUID id,
                                                  @Valid @ModelAttribute OrganizationEditDTO organizationDTO,
                                                  @AuthenticationPrincipal Jwt token) {
        return organizationService.update(id, organizationDTO, token);
    }

    @Secured(UserRole.ADMIN)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganization(@PathVariable("id") UUID id) {
        organizationService.deleteById(id);
    }

    @Secured(UserRole.ORGANIZER)
    @GetMapping("/{organizationId}/volunteers")
    public List<UserViewDTO> getVolunteers(@PathVariable UUID organizationId,
                                           @RequestParam(value = "activityId", required = false) UUID activityId,
                                           @RequestParam(value = "scopes", required = false) List<String> scopes) {
        List<UserViewDTO> organizationVolunteers = organizationService.getOrganizationVolunteers(organizationId, activityId, scopes);
        return organizationVolunteers.stream()
                .map(user -> new UserViewDTO(
                        user.id(),
                        null,
                        user.firstName(),
                        user.lastName(),
                        user.email(),
                        null,
                        null,
                        null,
                        null,
                        user.scopes(),
                        null,
                        user.participations(),
                        null,
                        user.acknowledgements()
                ))
                .toList();
    }

    @Secured(UserRole.ORGANIZER)
    @PutMapping("/{organizationId}/volunteers/cancel-partnership")
    public void removeVolunteer(@PathVariable UUID organizationId, @RequestBody UserIdsRequest userIdsRequest) {
        userIdsRequest.userIds().forEach(userId -> organizationService.cancelPartnership(organizationId, userId));
    }
}
