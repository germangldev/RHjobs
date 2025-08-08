package com.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "webhook")
@Getter @Setter
public class WebhookProperties {
    private String url;
    private String event;
    private String payloadType;
    private int timeout;
    private int maxRetryAttempts;
    private int retryDelay;
    private String secret;
}


