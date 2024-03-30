package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scopes")
public class Scope {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    @Column(unique = true, nullable = false) private String name;

    @ManyToMany(mappedBy = "scopes")
    private Set<Activity> activities = new HashSet<>();

    @ManyToMany(mappedBy = "scopes")
    private Set<User> users = new HashSet<>();
}
