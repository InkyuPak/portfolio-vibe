package com.pak.portfolio.experience.controller;

import com.pak.portfolio.experience.dto.ExperienceDtos.AdminExperienceResponse;
import com.pak.portfolio.experience.dto.ExperienceDtos.ExperienceRequest;
import com.pak.portfolio.experience.dto.ExperienceDtos.PublicExperienceResponse;
import com.pak.portfolio.experience.service.ExperienceCommandService;
import com.pak.portfolio.experience.service.ExperienceQueryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExperienceController {

    private final ExperienceQueryService experienceQueryService;
    private final ExperienceCommandService experienceCommandService;

    public ExperienceController(
            ExperienceQueryService experienceQueryService,
            ExperienceCommandService experienceCommandService) {
        this.experienceQueryService = experienceQueryService;
        this.experienceCommandService = experienceCommandService;
    }

    @GetMapping("/api/public/experience")
    public List<PublicExperienceResponse> publicExperience(@RequestParam(defaultValue = "ko") String lang) {
        return experienceQueryService.getPublished(lang);
    }

    @GetMapping("/api/admin/experience")
    public List<AdminExperienceResponse> adminExperience() {
        return experienceQueryService.getAdminList();
    }

    @PostMapping("/api/admin/experience")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminExperienceResponse create(@Valid @RequestBody ExperienceRequest request) {
        return experienceCommandService.create(request);
    }

    @PutMapping("/api/admin/experience/{id}")
    public AdminExperienceResponse update(@PathVariable Long id, @Valid @RequestBody ExperienceRequest request) {
        return experienceCommandService.update(id, request);
    }

    @DeleteMapping("/api/admin/experience/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        experienceCommandService.delete(id);
    }
}
