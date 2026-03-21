package com.pak.portfolio.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.OffsetDateTime;

public final class ContactDtos {

    private ContactDtos() {
    }

    public record ContactRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            String company,
            @NotBlank String message) {
    }

    public record ContactMessageResponse(
            Long id,
            String name,
            String email,
            String company,
            String message,
            String status,
            OffsetDateTime createdAt) {
    }
}
