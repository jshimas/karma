package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.RegistrationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken, UUID> {
}
