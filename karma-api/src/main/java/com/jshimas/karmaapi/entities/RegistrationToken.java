package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "registration_tokens")
public class RegistrationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID token;
    @NotNull
    private Instant validUntil;
    @ManyToOne @JoinColumn(name = "organization_id")
    private Organization organization;
}
