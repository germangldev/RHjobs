package com.demo.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RegistrationEmailListener {

    private final EmailService emailService;

    public RegistrationEmailListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(
        topics = "user-registered-events",
        groupId = "email-service-group",
        containerFactory = "userRegisteredKafkaListenerFactory")
    public void handleUserRegistered(UserRegisteredEvent event) {
        emailService.sendWelcomeEmail(event.getEmail(), event.getNombre());
    }

    
}

