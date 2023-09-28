package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.OrganizationEditDTO;
import com.jshimas.karmaapi.domain.dto.OrganizationViewDTO;
import com.jshimas.karmaapi.services.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {
    private final OrganizationService organizationService;

    @GetMapping("/{id}")
    public OrganizationViewDTO getOrganizationById(@PathVariable UUID id) {
        return organizationService.findById(id);
    }

    @GetMapping()
    public List<OrganizationViewDTO> getAllOrganizations() {
        return organizationService.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createOrganization(@Valid @RequestBody OrganizationEditDTO organizationDTO) {
        OrganizationViewDTO createdOrganization = organizationService.create(organizationDTO);

        URI location = URI.create("/api/v1/organizations/" + createdOrganization.id());

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrganization(@PathVariable("id") UUID id,
                                   @Valid @RequestBody OrganizationEditDTO organizationDTO) {
        organizationService.update(id, organizationDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganization(@PathVariable("id") UUID id) {
        organizationService.deleteById(id);
    }
}
