package com.demo.token;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    // Buscar un refreshToken por su valor
    Optional<RefreshToken> findByToken(String token);
}
