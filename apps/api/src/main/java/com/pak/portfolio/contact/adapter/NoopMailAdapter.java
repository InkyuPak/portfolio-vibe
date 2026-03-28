package com.pak.portfolio.contact.adapter;

import com.pak.portfolio.contact.port.MailPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "portfolio.mail.enabled", havingValue = "false", matchIfMissing = true)
public class NoopMailAdapter implements MailPort {

    private static final Logger log = LoggerFactory.getLogger(NoopMailAdapter.class);

    @Override
    public void sendContactNotification(String subject, String body) {
        log.info("Contact notification [{}]: {}", subject, body);
    }
}
