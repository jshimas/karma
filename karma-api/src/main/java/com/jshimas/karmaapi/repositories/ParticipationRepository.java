package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipationRepository extends JpaRepository<Participation, UUID> {
    Optional<Participation> findByActivityIdAndVolunteerId(UUID activityId, UUID userId);
    boolean existsByActivityIdAndVolunteerId(UUID activityId, UUID userId);
    List<Participation> findAllByVolunteerId(UUID userId);

}
