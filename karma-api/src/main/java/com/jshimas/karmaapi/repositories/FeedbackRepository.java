package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Event;
import com.jshimas.karmaapi.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    @Query("SELECT f FROM Feedback f WHERE f.id = :feedbackId AND f.event.id = :eventId")
    Optional<Feedback> findByIdAndEventId(@Param("feedbackId") UUID feedbackId, @Param("eventId") UUID eventId);
}
