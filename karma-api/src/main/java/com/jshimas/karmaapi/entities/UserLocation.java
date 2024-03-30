package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_locations")
public class UserLocation {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull
    @ManyToOne @JoinColumn(name = "user_id") private User user;
    @Column(columnDefinition = "Geometry(Point,4326)")
    private Point location;
    @NotNull @NotBlank
    private String address;
    @NotNull @NotBlank
    private String name;
}
