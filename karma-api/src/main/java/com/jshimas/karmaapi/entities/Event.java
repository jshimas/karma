package com.jshimas.karmaapi.entities;

import com.vividsolutions.jts.geom.Point;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @ManyToOne @JoinColumn(name = "organization_id") private Organization organization;
    @NotNull@ NotBlank private String name;
    @NotNull private Instant startDate;
    @NotNull @NotBlank private String description;
    @NotNull @NotBlank private String duration;
    @NotNull @NotBlank private String location;
    @Column(columnDefinition = "Geometry(Point,4326)") private Point geoLocation;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL) private List<Feedback> feedbacks;

    @CreationTimestamp private Timestamp createdAt;
    @UpdateTimestamp private Timestamp updatedAt;

    public void setOrganization(Organization organization) {
        this.organization = organization;
        organization.getEvents().add(this);
    }
}
