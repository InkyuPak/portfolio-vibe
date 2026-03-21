package com.pak.portfolio.auth.service;

import com.pak.portfolio.auth.dto.AuthDtos.LoginRequest;
import com.pak.portfolio.auth.dto.AuthDtos.SessionResponse;
import com.pak.portfolio.auth.repository.AdminUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminSessionService {

    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository adminUserRepository;

    public AdminSessionService(AuthenticationManager authenticationManager, AdminUserRepository adminUserRepository) {
        this.authenticationManager = authenticationManager;
        this.adminUserRepository = adminUserRepository;
    }

    @Transactional
    public SessionResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        return adminUserRepository.findByUsername(request.username())
                .map(user -> new SessionResponse(user.getUsername(), user.getDisplayName(), true))
                .orElseGet(() -> new SessionResponse(authentication.getName(), authentication.getName(), true));
    }

    @Transactional
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }
        response.setHeader("Clear-Site-Data", "\"cookies\"");
        return ResponseEntity.noContent().build();
    }

    public SessionResponse currentUser(Authentication authentication) {
        return adminUserRepository.findByUsername(authentication.getName())
                .map(user -> new SessionResponse(user.getUsername(), user.getDisplayName(), true))
                .orElseGet(() -> new SessionResponse(authentication.getName(), authentication.getName(), true));
    }
}
