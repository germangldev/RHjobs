package com.demo.auth;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    private String role;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    private Boolean enabled;


}
