package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "participations")
public class Participation {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @ManyToOne @JoinColumn(name = "application_id") private Application application;
    @NotNull @ManyToOne @JoinColumn(name = "organizer_id") private Organizer organizer;
    @NotNull @OneToMany(mappedBy = "participation") private Set<Acknowledgement> acknowledgements = new HashSet<>();
    @NotNull private boolean isConfirmed;
    @CreationTimestamp private Instant dateOfInvitation;
    private Instant dateOfConfirmation;
    private Integer hoursWorked;
}
