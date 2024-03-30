package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @NotBlank private String comment;
    @NotNull @ManyToOne @JoinColumn(name = "activity_id") private Activity activity;
    @NotNull @ManyToOne @JoinColumn(name = "user_id") private User user;

    public void setActivity(Activity activity) {
        this.activity = activity;
        activity.getFeedbacks().add(this);
    }

    public void setUser(User user) {
        this.user = user;
        user.getFeedbacks().add(this);
    }
}
