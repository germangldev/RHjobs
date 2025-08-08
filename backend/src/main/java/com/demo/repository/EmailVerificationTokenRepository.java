package com.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.model.EmailVerificationToken;
import com.demo.model.Usuario;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);//SELECT * FROM EVT WHERE token = :token;
    List<EmailVerificationToken> findAllByUsuario(Usuario user);//SELECT * FROM EVT WHERE user_id = :user;
    /*findByCampo → SELECT ... WHERE campo = ?

        findAllByCampo → lo mismo, pero devuelve lista.

        deleteByCampo → DELETE ... WHERE campo = ?

        existsByCampo → SELECT COUNT ... > 0 
        findByCampo → Buscar 1

        findAllByCampo → Buscar lista

        deleteByCampo → Borrar

        existsByCampo → Verificar existencia

        countByCampo → Contar

        Puedes encadenar:

        findByCampoAndOtroCampo

        findByCampoOrOtroCampo

        findByCampoOrderByOtroCampoDesc*/
}

