package com.demo.kafka;

import lombok.*;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
public class UserVerificationEvent {
    private String email;
    private String token;
    // getters y setters
}

