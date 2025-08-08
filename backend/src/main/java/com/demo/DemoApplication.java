package com.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.demo.config.JwtProperties;
import com.demo.config.SecurityProperties;
import com.demo.config.WebhookProperties;
import com.demo.model.Usuario;
import com.demo.repository.UsuarioRepository;

@SpringBootApplication
@EnableConfigurationProperties({
    WebhookProperties.class, JwtProperties.class, SecurityProperties.class})
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        
    }    

    // creamos un usuario por defecto al iniciar
    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder encoder) {
    return args -> {
        if (usuarioRepository.findByEmail("admin@example.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail("admin@example.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            usuarioRepository.save(admin);
            System.out.println("Usuario admin creado: admin@example.com / admin123");
        }

        if (usuarioRepository.findByEmail("user@example.com").isEmpty()) {
            Usuario user = new Usuario();
            user.setNombre("Usuario");
            user.setEmail("user@example.com");
            user.setPassword(encoder.encode("user123"));
            user.setRole("ROLE_USER");
            usuarioRepository.save(user);
            System.out.println("Usuario user creado: user@example.com / user123");
        }
    };
}

}
