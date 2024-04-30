package com.jshimas.karmaapi.repositories;

import com.jshimas.karmaapi.entities.Prize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PrizeRepository extends JpaRepository<Prize, UUID> {
}
