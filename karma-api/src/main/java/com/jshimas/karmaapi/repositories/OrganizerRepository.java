package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrganizerRepository extends JpaRepository<Organizer, UUID> {
}
