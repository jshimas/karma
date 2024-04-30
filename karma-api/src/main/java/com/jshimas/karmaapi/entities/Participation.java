package com.jshimas.karmaapi.entities;

import io.hypersistence.utils.hibernate.type.basic.PostgreSQLEnumType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;

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
    @NotNull @ManyToOne @JoinColumn(name = "activity_id") private Activity activity;
    @NotNull @ManyToOne @JoinColumn(name = "user_id") private User volunteer;
    @OneToMany(mappedBy = "participation") private Set<Acknowledgement> acknowledgements = new HashSet<>();
    private Boolean isConfirmed;
    @CreationTimestamp private Instant dateOfInvitation;
    private Instant dateOfConfirmation;
    private Integer karmaPoints;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "participation_type")
    @Type(value = PostgreSQLEnumType.class)
    private ParticipationType type;
}
