package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.OrganizationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface OrganizationTypeRepository extends JpaRepository<OrganizationType, Long> {
    Optional<OrganizationType> findByTypeNameIgnoreCase(String typeName);
}
