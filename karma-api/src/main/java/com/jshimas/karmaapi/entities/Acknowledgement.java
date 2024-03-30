package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Setter
@Getter
@Table(name = "acknowledgements")
public class Acknowledgement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "participation_id") private Participation participation;
    @ManyToOne @JoinColumn(name = "organizer_id") private User organizer;
    @NotNull @NotBlank
    private String text;
}
