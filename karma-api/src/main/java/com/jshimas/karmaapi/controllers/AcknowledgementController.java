package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.CreateAcknowledgementRequest;
import com.jshimas.karmaapi.services.AcknowledgementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/organizations/{organizationId}/activities/{activityId}/acknowledgements")
public class AcknowledgementController {
    private final AcknowledgementService acknowledgementService;

    @PostMapping
    public void createAcknowledgements(@PathVariable UUID organizationId,
                                       @PathVariable UUID activityId,
                                       @Valid @RequestBody CreateAcknowledgementRequest request) {
        acknowledgementService.createAcknowledgementForUsers(organizationId, activityId, request);
    }
}
