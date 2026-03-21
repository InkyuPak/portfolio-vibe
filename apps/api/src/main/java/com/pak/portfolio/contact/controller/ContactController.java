package com.pak.portfolio.contact.controller;

import com.pak.portfolio.contact.dto.ContactDtos.ContactMessageResponse;
import com.pak.portfolio.contact.dto.ContactDtos.ContactRequest;
import com.pak.portfolio.contact.service.ContactCommandService;
import com.pak.portfolio.contact.service.ContactQueryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContactController {

    private final ContactCommandService contactCommandService;
    private final ContactQueryService contactQueryService;

    public ContactController(ContactCommandService contactCommandService, ContactQueryService contactQueryService) {
        this.contactCommandService = contactCommandService;
        this.contactQueryService = contactQueryService;
    }

    @PostMapping("/api/public/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactMessageResponse create(@Valid @RequestBody ContactRequest request) {
        return contactCommandService.create(request);
    }

    @GetMapping("/api/admin/contact-messages")
    public List<ContactMessageResponse> adminMessages() {
        return contactQueryService.getAdminList();
    }
}
