package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.PrizeEditDTO;
import com.jshimas.karmaapi.domain.dto.PrizeViewDTO;

import java.util.List;
import java.util.UUID;

public interface PrizeService {
    PrizeViewDTO create(PrizeEditDTO prizeEditDTO, UUID organizationId);
    void update(UUID id, PrizeEditDTO prizeEditDTO);
    void delete(UUID id);
    PrizeViewDTO findById(UUID id);
    List<PrizeViewDTO> findAll(UUID organizationId);
    void redeemPrize(UUID prizeId, UUID userId);
}
