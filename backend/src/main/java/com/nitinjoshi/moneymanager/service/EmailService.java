package com.nitinjoshi.moneymanager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String body) {

        System.out.println("========== EMAIL DEBUG ==========");
        System.out.println("To: " + to);
        System.out.println("From: " + fromEmail);

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            System.out.println("Calling mailSender.send()...");

            mailSender.send(message);

            System.out.println("EMAIL SENT SUCCESSFULLY");

        } catch (Exception e) {
            System.out.println("========== EMAIL ERROR ==========");
            e.printStackTrace();
            System.out.println("=================================");
            throw new RuntimeException("Failed to send activation email", e);
        }
    }
}