package com.demo.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
public class UserVerificationListener {

    private final EmailService emailService;
    


    @KafkaListener(
    topics = "user-registration-pending",
    groupId = "email-service-group",
    containerFactory = "userRegisteredKafkaListenerFactory")
    public void handleVerification(UserVerificationEvent event) {
        String subject = "Verifica tu cuenta";
        String body = "Tu código de verificación es: " + event.getToken() + "\nEste código expira en 15 minutos.";
        emailService.sendSimpleEmail(event.getEmail(), subject, body);
    }


}
