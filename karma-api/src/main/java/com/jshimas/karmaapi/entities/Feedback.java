package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull Integer rating;
    private String comment;
    @NotNull @ManyToOne @JoinColumn(name = "activity_id") private Activity activity;
    @NotNull @ManyToOne @JoinColumn(name = "user_id") private User user;

    @CreationTimestamp private Instant createdAt;
    @UpdateTimestamp private Instant updatedAt;

    public void setActivity(Activity activity) {
        this.activity = activity;
        activity.getFeedbacks().add(this);
    }

    public void setUser(User user) {
        this.user = user;
        user.getFeedbacks().add(this);
    }
}
