package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @NotBlank private String motivation;
    private Boolean isApproved;
    @NotNull @Builder.Default private Boolean valid = true;
    @NotNull @ManyToOne @JoinColumn(name = "activity_id") private Activity activity;
    @NotNull @ManyToOne @JoinColumn(name = "user_id") private User volunteer;
    @CreationTimestamp private Instant dateOfApplication;
    private Instant dateOfApproval;
}
