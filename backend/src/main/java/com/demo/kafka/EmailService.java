package com.demo.kafka;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;
import com.demo.config.AWSProperties;

@Service
public class EmailService {

        private final AWSProperties awsProperties;
    private final SesClient sesClient;
    private final String sender;

    public EmailService(AWSProperties awsProperties) {
        this.awsProperties = awsProperties;
        this.sesClient = SesClient.builder()
                .region(Region.of("eu-west-3")) // cambia si tu SES está en otra región
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(
                                awsProperties.getAccessKey(),
                                awsProperties.getSecretKey())
                ))
                .build();
        this.sender = awsProperties.getEmailFrom();
    }

    //mail bienvenida
    public void sendWelcomeEmail(String to, String name) {
    String subject = "¡Bienvenido, " + name + "!";
    String body = "Hola " + name + ",\n\nGracias por registrarte en nuestra aplicación.\n\n¡Un saludo!";
    
    SendEmailRequest request = SendEmailRequest.builder()
            .destination(Destination.builder().toAddresses(to).build())
            .message(Message.builder()
                    .subject(Content.builder().data(subject).build())
                    .body(Body.builder()
                            .text(Content.builder().data(body).build())
                            .build())
                    .build())
            .source(sender)
            .build();
    sesClient.sendEmail(request);
        }
        //requerimiento registro
        public void sendSimpleEmail(String to, String subject, String body) {
                SendEmailRequest request = SendEmailRequest.builder()
                        .destination(Destination.builder().toAddresses(to).build())
                        .message(Message.builder()
                                .subject(Content.builder().data(subject).build())
                                .body(Body.builder()
                                        .text(Content.builder().data(body).build())
                                        .build())
                                .build())
                        .source(sender)
                        .build();
                sesClient.sendEmail(request);
        }

}
