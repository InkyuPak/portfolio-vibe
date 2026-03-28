package com.pak.portfolio.contact.adapter;

import com.pak.portfolio.contact.port.MailPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "portfolio.mail.enabled", havingValue = "true")
public class GmailMailAdapter implements MailPort {

    private static final Logger log = LoggerFactory.getLogger(GmailMailAdapter.class);

    private final JavaMailSender mailSender;
    private final String to;
    private final String from;

    public GmailMailAdapter(
            JavaMailSender mailSender,
            @Value("${portfolio.mail.to}") String to,
            @Value("${portfolio.mail.from}") String from) {
        this.mailSender = mailSender;
        this.to = to;
        this.from = from;
    }

    @Override
    public void sendContactNotification(String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject("[pak.dev] " + subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Contact notification sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send contact notification: {}", e.getMessage());
        }
    }
}
