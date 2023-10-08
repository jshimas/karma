package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.RefreshToken;
import com.jshimas.karmaapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
