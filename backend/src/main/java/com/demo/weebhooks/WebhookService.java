package com.demo.weebhooks;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.demo.config.WebhookProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class WebhookService {

    //configuraciones
    private final WebhookProperties webhookProperties;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper(); // log JSON
  
    public void sendNewUserWebhook(String email, String nombre, String role) {
        var url = webhookProperties.getUrl();
        var maxAttempts = webhookProperties.getMaxRetryAttempts();
        var payloadType = webhookProperties.getPayloadType();
        var secret = webhookProperties.getSecret();
        var retryDelay = webhookProperties.getRetryDelay();

        NewUserWebhookPayload payload = new NewUserWebhookPayload(          
                url,
                nombre,
                email,
                role,
                Instant.now()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(payloadType));
        headers.set("X-Webhook-Token", secret);

        HttpEntity<NewUserWebhookPayload> request = new HttpEntity<>(payload, headers);

        int attempt = 0;
        boolean sent = false;

        while (attempt < maxAttempts && !sent) {
            try {
                attempt++;
                var response = restTemplate.postForEntity(url, request, String.class);
                System.out.println("[WEBHOOK] Enviado correctamente (intento " + attempt + "): " +
                        mapper.writerWithDefaultPrettyPrinter().writeValueAsString(payload));
                System.out.println("[WEBHOOK] Estado: " + response.getStatusCode());
                sent = true;
            } catch (Exception e) {
                System.err.println("[WEBHOOK] Fallo en intento " + attempt + ": " + e.getMessage());
                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(retryDelay);
                    } catch (InterruptedException ex) {
                        Thread.currentThread().interrupt();
                    }
                } else {
                    System.err.println("[WEBHOOK] Falló tras " + maxAttempts + " intentos.");
                }
            }
        }
    }
}