package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @NotBlank private String comment;
    @ManyToOne @JoinColumn(name = "event_id") private Event event;
    @ManyToOne @JoinColumn(name = "user_id") private User user;
}
