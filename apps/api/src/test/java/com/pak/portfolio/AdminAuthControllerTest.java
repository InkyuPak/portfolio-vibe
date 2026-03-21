package com.pak.portfolio;

import com.pak.portfolio.auth.controller.AdminAuthController;
import com.pak.portfolio.auth.dto.AuthDtos.LoginRequest;
import com.pak.portfolio.auth.dto.AuthDtos.SessionResponse;
import com.pak.portfolio.auth.service.AdminSessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AdminAuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminSessionService adminSessionService;

    @Test
    void shouldLoginThroughSessionService() throws Exception {
        when(adminSessionService.login(any(LoginRequest.class), any(HttpServletRequest.class)))
                .thenReturn(new SessionResponse("admin", "Park Inkyu", true));

        mockMvc.perform(post("/api/admin/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "admin",
                                  "password": "change-me"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.authenticated").value(true));
    }
}
