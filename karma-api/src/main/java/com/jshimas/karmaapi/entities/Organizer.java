package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "organizers")
public class Organizer {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @NotBlank @OneToOne @JoinColumn(name = "user_id") private User user;
    @NotNull @NotBlank @ManyToOne @JoinColumn(name = "organization_id") private Organization organization;
}
