package com.demo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
                System.out.println("Swagger config cargada");

        return new OpenAPI()
                .info(new Info()
                        .title("API - Gestión de Usuarios")
                        .version("1.0")
                        .description("Documentación de la API con roles y seguridad")
                        .contact(new Contact()
                                .name("Equipo Desarrollo")
                                .email("germangldeveloper@gmail.com")
                        )
                        
                )
                // Requerimos JWT para los endpoints
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("Authorization")
                                        
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                );
    }
}
