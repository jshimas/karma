package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipationRepository extends JpaRepository<Participation, UUID> {
    Optional<Participation> findByApplicationId(UUID applicationId);
    @Query(value = "SELECT p FROM Participation p " +
            "JOIN FETCH p.application a " +
            "JOIN FETCH a.user u " +
            "WHERE u.id = :userId")
    List<Participation> findAllByUserId(UUID userId);

}
