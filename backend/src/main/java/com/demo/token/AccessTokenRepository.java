package com.demo.token;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {
    // Buscar todos los tokens activos de un usuario
    List<AccessToken> findAllValidTokensByUser_IdAndExpiredFalseAndRevokedFalse(Long userId);

}
