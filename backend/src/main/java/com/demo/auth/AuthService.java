package com.demo.auth;

import org.springframework.kafka.core.KafkaTemplate;

import com.demo.kafka.UserRegisteredEvent;
import com.demo.kafka.UserVerificationEvent;
import com.demo.model.EmailVerificationToken;
import com.demo.model.Usuario;
import com.demo.repository.EmailVerificationTokenRepository;
import com.demo.repository.UsuarioRepository;
import com.demo.security.JwtService;
import com.demo.token.*;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import jakarta.transaction.Transactional;
import com.demo.exception.*;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    //nuevos repositorios: tokens separados
    private final AccessTokenRepository accessTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    //añadimos aquí el t.repository
    private final EmailVerificationTokenRepository tokenRepository; 
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    //inyectamos constructores kafka
    private final KafkaTemplate<String, UserVerificationEvent> userVerificationKafkaTemplate;
    private final KafkaTemplate<String, UserRegisteredEvent> userRegisteredKafkaTemplate;

    //Registro de nuevos usuarios pendientes de verificación
    public void registerPendingUser(Usuario user) {
        user.setEnabled(false); // no activado todavía
        usuarioRepository.save(user);

        String token = String.format("%06d", new Random().nextInt(999999)); // código de 6 dígitos

        EmailVerificationToken verification = EmailVerificationToken.builder()
        .usuario(user)
        .token(token)
        .expiresAt(LocalDateTime.now().plusMinutes(15))
        .build();

        tokenRepository.save(verification);

        // Publicar evento verificacion
        UserVerificationEvent event = new UserVerificationEvent(user.getEmail(), token);
        userVerificationKafkaTemplate.send("user-registration-pending", event);
    }

    @Transactional
    public void verifyEmail(VerifyEmailRequest request){

        
        //buscamos token
        EmailVerificationToken verification = tokenRepository.findByToken(request.getToken())
            .orElseThrow(() -> new InvalidTokenException("Token no existe"));

        Usuario user = verification.getUsuario();
        

        // Verificar que el token corresponde al email
        if (!user.getEmail().equals(request.getEmail())) {
            throw new InvalidTokenException("El token no corresponde al usuario");
        }

        //Comprobar expiración
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            // Regeneramos automáticamente el token
            regenerateToken(user);
            throw new ExpiredTokenException("El token ha caducado. Se ha enviado uno nuevo a su correo.");
        }
        
        //Activar usuario
        user.setEnabled(true);
        usuarioRepository.save(user);
        
        //Borrar token usado
        tokenRepository.delete(verification);

        //publicamos evento bienvenida tras confirmar
        UserRegisteredEvent event = new UserRegisteredEvent(user.getEmail(), user.getNombre());
        userRegisteredKafkaTemplate.send("user-registered-events", event);

    }

    //regeneramos token en caso de fallo o tiempo
    private void regenerateToken(Usuario user) {
        tokenRepository.deleteAll(tokenRepository.findAllByUsuario(user));

        String newToken = String.format("%06d", new Random().nextInt(999999));
        EmailVerificationToken newVerification = EmailVerificationToken.builder()
                .usuario(user)
                .token(newToken)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(newVerification);

        UserVerificationEvent event = new UserVerificationEvent(user.getEmail(), newToken);
        userVerificationKafkaTemplate.send("user-registration-pending", event);
}


    //Registro normal (con tokens). Forzamos enabled=false para requerir confirmación
    public AuthenticationResponse register(RegisterRequest request) {
        // Crear nuevo usuario
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya existe");
        }
        Usuario user = Usuario.builder()//id
            .email(request.getEmail())
            .nombre(request.getNombre())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole() != null ? request.getRole() : "ROLE_USER")
            .enabled(false)//esperando confirmacion correo
            .build();
        usuarioRepository.save(user);

        //evento kafka
        registerPendingUser(user);

        // Convertir a UserDetails
        UserDetails userDetails = User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();

        // Generar tokens
        var authKey = jwtService.generateToken(userDetails);         // access token
        var sessionKey = jwtService.generateRefreshToken(userDetails); // refresh token

        // Revocar solo access tokens antiguos
        revokeAllAccessTokens(user);
        // Guardar nuevos tokens
        saveAccessToken(user, authKey);
        saveRefreshToken(user, sessionKey);

        // Devolver respuesta
        return AuthenticationResponse.builder()
                .accessToken(authKey)     // lo llamaremos authKey en frontend
                .refreshToken(sessionKey) // lo llamaremos sessionKey en frontend
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Autenticación de usuarios existentes.
     * Valida credenciales y devuelve tokens.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Verificar credenciales
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Buscar usuario
        Usuario user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Convertir a UserDetails
        UserDetails userDetails = User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();

        // Generar tokens
        String authKey = jwtService.generateToken(userDetails);
        String sessionKey = jwtService.generateRefreshToken(userDetails);

        // Revocar access tokens anteriores
        revokeAllAccessTokens(user);

        // Guardar nuevos tokens
        saveAccessToken(user, authKey);
        saveRefreshToken(user, sessionKey);

        // Devolver respuesta
        return AuthenticationResponse.builder()
                .accessToken(authKey)
                .refreshToken(sessionKey)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Guardar un AccessToken válido en la BD.
     */
    private void saveAccessToken(Usuario user, String token) {
        AccessToken accessToken = AccessToken.builder()
                .token(token)
                .user(user)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        accessTokenRepository.save(accessToken);
    }

    /**
     * Guardar un RefreshToken válido en la BD.
     * Si ya existe uno activo, podemos mantenerlo (o rotar si quieres mayor seguridad).
     */
    private void saveRefreshToken(Usuario user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    /**
     * Refrescar el access token usando un refresh token válido.
     */
    public AuthenticationResponse refreshToken(String sessionKey) {
    System.out.println("Intentando refrescar token...");
    System.out.println("SessionKey recibido: " + sessionKey);

    try {
        // Buscar el token en la BD
        Optional<RefreshToken> refreshTokenRecord = refreshTokenRepository.findByToken(sessionKey);
        if (refreshTokenRecord.isEmpty() || refreshTokenRecord.get().isRevoked()) {
            System.out.println("SessionKey no encontrado o revocado");
            throw new IllegalArgumentException("Refresh token no encontrado o revocado"); // <-- mensaje más claro
        }

        // Extraer email del JWT
        String email;
        try {
            email = jwtService.extractUsername(sessionKey);
            System.out.println("Usuario extraído del token: " + email);
        } catch (JwtException e) {
            System.out.println("No se pudo extraer usuario: " + e.getMessage());
            throw new IllegalArgumentException("Formato Refresh token inválido"); // <-- más claro
        }

        // Buscar usuario
        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("Usuario no encontrado: " + email);
                    return new UsernameNotFoundException("Usuario no encontrado");
                });

        // Verificar validez del token
        boolean valid = jwtService.isTokenValid(sessionKey,user);
        System.out.println("¿SessionKey válido?: " + valid);

        if (!valid) {
            System.out.println("SessionKey expirado o inválido para el usuario: " + email);
            throw new IllegalArgumentException("Refresh token expirado o inválido"); // <-- mensaje mejorado
        }

        // Generar nuevo accessToken
        String newAuthKey = jwtService.generateToken(
                User.withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().replace("ROLE_", ""))
                        .build()
        );

        // Guardar nuevo accessToken
        saveAccessToken(user, newAuthKey);

        return AuthenticationResponse.builder()
                .accessToken(newAuthKey)
                .refreshToken(sessionKey)
                .email(user.getEmail())
                .role(user.getRole())
                .build();

    } catch (IllegalArgumentException | UsernameNotFoundException e) {
        // Lanzamos de nuevo estas excepciones para que el ControllerAdvice las maneje
        throw e;
    } catch (Exception e) {
        // Captura cualquier otro fallo inesperado
        e.printStackTrace();
        throw new RuntimeException("Error inesperado al refrescar token");
    }
}

    /**
     * Revocar todos los AccessTokens activos del usuario.
     * Los RefreshTokens no se tocan aquí (para mantener la sesión larga).
     */
    private void revokeAllAccessTokens(Usuario usuario) {
        var validTokens = accessTokenRepository.findAllValidTokensByUser_IdAndExpiredFalseAndRevokedFalse(usuario.getId());

        if (validTokens.isEmpty()) return;

        for (var token : validTokens) {
            token.setExpired(true);
            token.setRevoked(true);
        }

        accessTokenRepository.saveAll(validTokens);
    }

    /**
     * Revocar un RefreshToken específico (logout total).
     */
    public void revokeRefreshToken(String sessionKey) {
        refreshTokenRepository.findByToken(sessionKey).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }
}
