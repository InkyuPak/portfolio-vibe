package com.pak.portfolio.contact.service;

import com.pak.portfolio.contact.dto.ContactDtos.ContactMessageResponse;
import com.pak.portfolio.contact.repository.ContactMessageRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ContactQueryService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactQueryService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public List<ContactMessageResponse> getAdminList() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(message -> new ContactMessageResponse(
                        message.getId(),
                        message.getName(),
                        message.getEmail(),
                        message.getCompany(),
                        message.getMessage(),
                        message.getStatus().name(),
                        message.getCreatedAt()))
                .toList();
    }
}
