package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Acknowledgement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AcknowledgementRepository extends JpaRepository<Acknowledgement, UUID> {
}
