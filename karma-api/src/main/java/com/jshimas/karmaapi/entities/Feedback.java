package com.jshimas.karmaapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @NotNull @NotBlank private String comment;
    @NotNull @ManyToOne @JoinColumn(name = "event_id") private Event event;
    @NotNull @ManyToOne @JoinColumn(name = "user_id") private User user;

    public void setEvent(Event event) {
        this.event = event;
        event.getFeedbacks().add(this);
    }

    public void setUser(User user) {
        this.user = user;
        user.getFeedbacks().add(this);
    }
}
