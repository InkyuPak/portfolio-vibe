package com.pak.portfolio.contact.port;

public interface MailPort {

    void sendContactNotification(String subject, String body);
}
