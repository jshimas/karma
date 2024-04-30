package com.jshimas.karmaapi.entities;

import com.google.api.services.people.v1.model.Interest;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @NotBlank private String firstName;
    @NotNull @NotBlank private String lastName;
    @NotNull @NotBlank @Email @Column(unique = true) private String email;
    @NotNull @ManyToOne @JoinColumn(name = "role_id") private UserRole role;
    @NotNull @ManyToOne @JoinColumn(name = "account_type_id") private AccountType accountType;
    private String imageUrl;
    private String bio;
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    @ManyToOne @JoinColumn(name = "organization_id") private Organization organization;
    @Builder.Default private Integer karmaPoints = 0;
    @OneToMany(mappedBy = "volunteer") private List<Application> applications;
    @OneToMany(mappedBy = "user") private List<Feedback> feedbacks;
    @OneToMany(mappedBy = "volunteer") private List<Participation> participations;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) private List<UserLocation> locations;
    @ManyToMany
    @JoinTable(
            name = "user_scopes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "scope_id")
    )
    private List<Scope> scopes = new ArrayList<>();
    @ManyToMany
    @JoinTable(
            name = "user_prizes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "prize_id")
    )
    private List<Prize> prizes = new ArrayList<>();

    @CreationTimestamp private Timestamp createdAt;
    @UpdateTimestamp private Timestamp updatedAt;

    public String getRole() {
        return role.getRole();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;

        return getId().equals(user.getId());
    }

    @Override
    public int hashCode() {
        return getId().hashCode();
    }
}
