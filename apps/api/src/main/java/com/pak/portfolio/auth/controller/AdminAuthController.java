package com.pak.portfolio.auth.controller;

import com.pak.portfolio.auth.dto.AuthDtos.LoginRequest;
import com.pak.portfolio.auth.dto.AuthDtos.SessionResponse;
import com.pak.portfolio.auth.service.AdminSessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminSessionService adminSessionService;

    public AdminAuthController(AdminSessionService adminSessionService) {
        this.adminSessionService = adminSessionService;
    }

    @PostMapping("/login")
    public SessionResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return adminSessionService.login(request, httpRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        return adminSessionService.logout(request, response);
    }

    @GetMapping("/me")
    public SessionResponse me(Authentication authentication) {
        return adminSessionService.currentUser(authentication);
    }
}
