package com.jshimas.karmaapi.controllers;

import com.jshimas.karmaapi.domain.dto.PrizeEditDTO;
import com.jshimas.karmaapi.domain.dto.PrizeViewDTO;
import com.jshimas.karmaapi.services.AuthTokenService;
import com.jshimas.karmaapi.services.PrizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PrizeController {
    private final PrizeService prizeService;
    private final AuthTokenService tokenService;

    @GetMapping("/prizes")
    public List<PrizeViewDTO> findAll() {
        return prizeService.findAll(null);
    }

    @PostMapping("/prizes/{id}/redeem")
    public void redeem(@PathVariable UUID id,
                       @AuthenticationPrincipal Jwt token) {
        UUID userId = tokenService.extractId(token);
        prizeService.redeemPrize(id, userId);
    }

    @GetMapping("/organizations/{organizationId}/prizes")
    public List<PrizeViewDTO> findAllByOrganizationId(@PathVariable UUID organizationId) {
        return prizeService.findAll(organizationId);
    }

    @PostMapping("/organizations/{organizationId}/prizes")
    public PrizeViewDTO create(@RequestBody PrizeEditDTO prizeEditDTO, @PathVariable UUID organizationId) {
        return prizeService.create(prizeEditDTO, organizationId);
    }

    @PutMapping("/organizations/{organizationId}/prizes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable UUID id, @RequestBody PrizeEditDTO prizeEditDTO) {
        prizeService.update(id, prizeEditDTO);
    }

    @DeleteMapping("/organizations/{organizationId}/prizes/{id}")
    public void delete(@PathVariable UUID id) {
        prizeService.delete(id);
    }
}
