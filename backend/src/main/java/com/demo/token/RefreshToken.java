package com.demo.token;

import com.demo.model.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Token JWT que usamos como sessionKey en el frontend
    private String token;

    // Usuario al que pertenece este token
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Usuario user;

    // Marcamos como revocado solo si hacemos logout total
    private boolean revoked;
}
