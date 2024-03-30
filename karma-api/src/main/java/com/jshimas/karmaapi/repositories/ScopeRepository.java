package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Scope;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ScopeRepository extends JpaRepository<Scope, UUID> {
    Optional<Scope> findByName(String name);
    boolean existsByName(String name);
}
