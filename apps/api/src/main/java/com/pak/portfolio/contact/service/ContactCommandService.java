package com.pak.portfolio.contact.service;

import com.pak.portfolio.contact.domain.ContactMessage;
import com.pak.portfolio.contact.dto.ContactDtos.ContactMessageResponse;
import com.pak.portfolio.contact.dto.ContactDtos.ContactRequest;
import com.pak.portfolio.contact.port.MailPort;
import com.pak.portfolio.contact.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ContactCommandService {

    private final ContactMessageRepository contactMessageRepository;
    private final MailPort mailPort;

    public ContactCommandService(ContactMessageRepository contactMessageRepository, MailPort mailPort) {
        this.contactMessageRepository = contactMessageRepository;
        this.mailPort = mailPort;
    }

    public ContactMessageResponse create(ContactRequest request) {
        ContactMessage message = contactMessageRepository.save(
                new ContactMessage(request.name(), request.email(), request.company(), request.message()));
        mailPort.sendContactNotification("New portfolio inquiry from %s".formatted(request.name()), request.message());
        return new ContactMessageResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getCompany(),
                message.getMessage(),
                message.getStatus().name(),
                message.getCreatedAt());
    }
}
