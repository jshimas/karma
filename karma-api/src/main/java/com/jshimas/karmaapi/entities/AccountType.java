package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "account_types")
public class AccountType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "type", nullable = false)
    private String type;

    public static final String EMAIL = "EMAIL";
    public static final String GOOGLE = "GOOGLE";
}
