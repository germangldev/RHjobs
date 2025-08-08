//receptor webhooks
package com.demo.weebhooks;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.demo.config.WebhookProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookProperties webhookProperties;

    @SuppressWarnings("unused")
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/new-user")
    public ResponseEntity<String> receiveWebhook(
        @RequestHeader(value = "X-Webhook-Token", required = false) String token,
        @RequestBody NewUserWebhookPayload payload) throws Exception {

        try {
        // Validar el token
        if (token == null || !token.equals(webhookProperties.getSecret())){
            System.out.println("[WEBHOOK] Rechazado: token inválido");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        }

        // Procesar el payload
        System.out.println("[WEBHOOK] Recibido correctamente:" + payload);
        return ResponseEntity.ok("Webhook recibido correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error al procesar el webhook"+ e.getMessage());
        }
    }
}