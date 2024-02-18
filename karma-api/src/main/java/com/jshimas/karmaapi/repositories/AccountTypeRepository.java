package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountTypeRepository extends JpaRepository<AccountType, Integer> {
    Optional<AccountType> findByTypeIgnoreCase(String type);
}
