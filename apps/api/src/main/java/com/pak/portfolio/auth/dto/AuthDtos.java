package com.pak.portfolio.auth.dto;

import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {
    }

    public record SessionResponse(String username, String displayName, boolean authenticated) {
    }
}
