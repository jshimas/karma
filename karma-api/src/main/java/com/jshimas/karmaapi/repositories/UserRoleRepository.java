package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.OrganizationType;
import com.jshimas.karmaapi.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {
    Optional<UserRole> findByRoleIgnoreCase(String role);
}
