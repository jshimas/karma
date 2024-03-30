package com.jshimas.karmaapi.services;

import com.jshimas.karmaapi.domain.dto.SendOrganizerInvitationRequest;

public interface EmailService {
    void sendEmail(String from, String to, String subject, String body);
    void sendRegistrationEmail(SendOrganizerInvitationRequest emailRequest, String token);
}
