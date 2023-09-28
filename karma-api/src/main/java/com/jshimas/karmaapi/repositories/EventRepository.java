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
public interface EventRepository extends JpaRepository<Event, UUID> {
    @Query("SELECT e FROM Event e WHERE e.id = :eventId AND e.organization.id = :organizationId")
    Optional<Event> findByIdAndOrganizationId(@Param("eventId") UUID eventId,
                                                 @Param("organizationId") UUID organizationId);
}
