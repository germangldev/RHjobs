package com.demo.auth;

import lombok.Data;

@Data
public class VerifyEmailRequest {
    private String email;
    private String token;
}

