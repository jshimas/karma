package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findAllByActivityId(UUID activityId);
    List<Application> findAllByVolunteerId(UUID userId);
}
