package com.demo.token;

import com.demo.model.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Token JWT que usamos como authKey en el frontend
    private String token;

    // Usuario al que pertenece este token
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Usuario user;

    // Flags para invalidar el token sin borrarlo
    private boolean expired;
    private boolean revoked;

    // Tipo de token (ej: BEARER)
    @Enumerated(EnumType.STRING)
    private TokenType tokenType; 
}
