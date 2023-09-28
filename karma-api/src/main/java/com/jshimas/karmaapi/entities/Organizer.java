package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "organizers")
public class Organizer {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @OneToOne @JoinColumn(name = "user_id") private User user;
    @NotNull @ManyToOne @JoinColumn(name = "organization_id") private Organization organization;
}
