package com.pak.portfolio.contact.adapter;

import com.pak.portfolio.contact.port.MailPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class NoopMailAdapter implements MailPort {

    private static final Logger log = LoggerFactory.getLogger(NoopMailAdapter.class);

    @Override
    public void sendContactNotification(String subject, String body) {
        log.info("Contact notification [{}]: {}", subject, body);
    }
}
