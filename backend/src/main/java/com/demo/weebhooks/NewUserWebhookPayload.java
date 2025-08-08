package com.demo.weebhooks;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewUserWebhookPayload {
    private String event;  // Tipo de evento (ej. NEW_USER_REGISTERED)
    private String email;        // Email
    private String nombre;         // Nombre del usuario          
    private String role;           // Rol (ej. ROLE_USER)
    private Instant fechaRegistro; // Fecha y hora del registro
}
