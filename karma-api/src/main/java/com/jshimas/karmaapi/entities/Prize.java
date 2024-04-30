package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "prizes")
public class Prize {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull private String name;
    @NotNull private String description;
    @NotNull private String instructions;
    @NotNull private Integer quantity;
    @NotNull private Integer price;
    @NotNull @ManyToOne @JoinColumn(name = "organization_id") private Organization organization;
    @ManyToMany(mappedBy = "prizes") private List<User> redeemedBy = List.of();
}
