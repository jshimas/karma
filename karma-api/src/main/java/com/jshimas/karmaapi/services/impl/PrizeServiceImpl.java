package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.PrizeEditDTO;
import com.jshimas.karmaapi.domain.dto.PrizeViewDTO;
import com.jshimas.karmaapi.domain.exceptions.ErrorResponse;
import com.jshimas.karmaapi.domain.exceptions.NotFoundException;
import com.jshimas.karmaapi.domain.mappers.PrizeMapper;
import com.jshimas.karmaapi.entities.Organization;
import com.jshimas.karmaapi.entities.Prize;
import com.jshimas.karmaapi.entities.User;
import com.jshimas.karmaapi.repositories.OrganizationRepository;
import com.jshimas.karmaapi.repositories.PrizeRepository;
import com.jshimas.karmaapi.repositories.UserRepository;
import com.jshimas.karmaapi.services.PrizeService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrizeServiceImpl implements PrizeService {
    private final PrizeRepository prizeRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PrizeMapper prizeMapper;

    @Override
    public PrizeViewDTO create(PrizeEditDTO prizeEditDTO, UUID organizationId) {
        Organization organization = organizationRepository.findById(organizationId).orElseThrow(
                () -> new NotFoundException(Organization.class, organizationId));

        Prize prize = prizeMapper.create(prizeEditDTO, organization);
        Prize savedPrize = prizeRepository.save(prize);

        return prizeMapper.toDTO(savedPrize);
    }

    @Override
    public void update(UUID id, PrizeEditDTO prizeEditDTO) {
        Prize prize = prizeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(Prize.class, id));

        Prize updatePrize = prizeMapper.updateEntityFromDTO(prizeEditDTO, prize);
        prizeRepository.save(updatePrize);
    }

    @Override
    public void delete(UUID id) {
        Prize prize = prizeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(Prize.class, id));

        prizeRepository.delete(prize);
    }

    @Override
    public PrizeViewDTO findById(UUID id) {
        Prize prize = prizeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(Prize.class, id));

        return prizeMapper.toDTO(prize);
    }

    @Override
    public List<PrizeViewDTO> findAll(UUID organizationId) {
        return prizeRepository.findAll().stream()
                .filter(prize -> filterByOrganizationId(prize, organizationId))
                .filter(prize -> prize.getQuantity() > prize.getRedeemedBy().size())
                .map(prizeMapper::toDTO)
                .toList();
    }

    private boolean filterByOrganizationId(Prize prize, UUID organizationId) {
        if (organizationId == null)
            return true;

        return prize.getOrganization().getId().equals(organizationId);
    }

    @Override
    public void redeemPrize(UUID prizeId, UUID userId) {
        Prize prize = prizeRepository.findById(prizeId).orElseThrow(
                () -> new NotFoundException(Prize.class, prizeId));

        User user = userRepository.findById(userId).orElseThrow(
                () -> new NotFoundException(User.class, userId));

        if (prize.getPrice() > user.getKarmaPoints())
            throw new ValidationException("User does not have enough karma points to redeem this prize");

        prize.getRedeemedBy().add(user);
        prizeRepository.save(prize);
        user.setKarmaPoints(user.getKarmaPoints() - prize.getPrice());
        user.getPrizes().add(prize);
        userRepository.save(user);
    }
}
