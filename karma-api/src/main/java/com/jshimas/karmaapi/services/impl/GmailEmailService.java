package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.domain.dto.SendOrganizerInvitationRequest;
import com.jshimas.karmaapi.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class GmailEmailService implements EmailService {
    private final JavaMailSender emailSender;
    @Override
    public void sendEmail(String from, String to, String subject, String body) {
        System.out.println("Sending email...");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@baeldung.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        try {
            emailSender.send(message);
        } catch (Exception e) {
            System.out.println("Error sending email: " + e.getMessage());
            System.out.println(Arrays.toString(e.getStackTrace()));
        }

        System.out.println("Email sent successfully");
    }

    @Override
    public void sendRegistrationEmail(SendOrganizerInvitationRequest emailRequest, String token) {
        String subject = String.format("Invitation to join %s at Karma", emailRequest.organizationName());
        String registrationLink = "http://localhost:5173/signup?token=" + token;
        String body = String.format("""
                Hi!
                 
                I am inviting you to join %s at Karma to help us manage our volunteer activities.
                Please click the link to register your organizer's account: %s
                (Link is valid for 7 days)
                
                See you soon!
                %s from %s
                """, emailRequest.organizationName(), registrationLink, emailRequest.fromName(), emailRequest.organizationName());

        sendEmail(emailRequest.fromEmail(), emailRequest.toEmail(), subject, body);
    }
}
