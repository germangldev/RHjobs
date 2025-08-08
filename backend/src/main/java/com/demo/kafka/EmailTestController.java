package com.demo.kafka;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-email")
public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public String sendTest(@RequestParam String to) {
        emailService.sendWelcomeEmail(to, to);
        return "Correo enviado a " + to;
    }
}
