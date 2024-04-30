package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "activities")
public class Activity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @ManyToOne @JoinColumn(name = "organization_id") private Organization organization;
    @NotNull @NotBlank private String name;
    @NotNull private Instant startDate;
    @NotNull private Instant endDate;
    @NotNull @NotBlank private String description;
    @NotNull @NotBlank private String address;
    @NotNull private Boolean isPublic;
    @Column(columnDefinition = "Geometry(Point,4326)")
    private Point geoLocation;
    @NotNull private Boolean resolved;
    @NotNull private Integer volunteersNeeded;
    @ManyToMany
    @JoinTable(
            name = "activity_scopes",
            joinColumns = @JoinColumn(name = "activity_id"),
            inverseJoinColumns = @JoinColumn(name = "scope_id")
    )
    private Set<Scope> scopes = new HashSet<>();
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL) private Set<Feedback> feedbacks = new HashSet<>();
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL) private Set<Application> applications = new HashSet<>();
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL) private Set<Participation> participations = new HashSet<>();

    @CreationTimestamp private Timestamp createdAt;
    @UpdateTimestamp private Timestamp updatedAt;

    public void setOrganization(Organization organization) {
        this.organization = organization;
        organization.getActivities().add(this);
    }
}
