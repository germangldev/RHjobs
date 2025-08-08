package com.demo.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.demo.model.Usuario;
import com.demo.repository.UsuarioRepository;
import com.demo.weebhooks.NewUserWebhookPayload;

import org.springframework.security.core.Authentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Registro, login y gestión de sesión")
public class AuthController {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok("Cuenta verificada correctamente. ¡Bienvenido!");
    }


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario yua existe");
        }
                return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> renewSession(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("sessionKey"); 
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> request) {
        String sessionKey = request.get("sessionKey");
        authService.revokeRefreshToken(sessionKey);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserProfileResponse response = new UserProfileResponse(
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRole()
        );

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/webhooks/new-user")
    public ResponseEntity<String> receiveWebhook(
            @RequestHeader("X-Webhook-Token") String token,
            @RequestBody NewUserWebhookPayload payload
    ) {
        if (!token.equals("MI_SUPER_TOKEN_SECRETO")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        System.out.println("Webhook válido recibido: " + payload);
        return ResponseEntity.ok("OK");
    }


}


