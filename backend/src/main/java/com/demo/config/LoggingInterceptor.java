package com.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Component
public class LoggingInterceptor implements HandlerInterceptor {

    private static final Logger logger = Logger.getLogger(LoggingInterceptor.class.getName());

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String user = (auth != null && auth.isAuthenticated()) ? auth.getName() : "ANONYMOUS";
        String endpoint = request.getRequestURI();
        String method = request.getMethod();

        String logMessage = String.format("[%s] Usuario: %s | Método: %s | Endpoint: %s",
                LocalDateTime.now(), user, method, endpoint);

        logger.info(logMessage);  // Guardar en fichero (configurado más abajo)
        return true;
    }
}
