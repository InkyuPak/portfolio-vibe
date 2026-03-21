package com.pak.portfolio.project.controller;

import com.pak.portfolio.project.dto.ProjectDtos.AdminProjectResponse;
import com.pak.portfolio.project.dto.ProjectDtos.ProjectRequest;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectDetailResponse;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectSummaryResponse;
import com.pak.portfolio.project.service.ProjectCommandService;
import com.pak.portfolio.project.service.ProjectQueryService;
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
public class ProjectController {

    private final ProjectQueryService projectQueryService;
    private final ProjectCommandService projectCommandService;

    public ProjectController(ProjectQueryService projectQueryService, ProjectCommandService projectCommandService) {
        this.projectQueryService = projectQueryService;
        this.projectCommandService = projectCommandService;
    }

    @GetMapping("/api/public/projects")
    public List<PublicProjectSummaryResponse> publicProjects(
            @RequestParam(defaultValue = "ko") String lang,
            @RequestParam(defaultValue = "false") boolean featured) {
        return projectQueryService.listPublished(lang, featured);
    }

    @GetMapping("/api/public/projects/{slug}")
    public PublicProjectDetailResponse publicProject(@PathVariable String slug, @RequestParam(defaultValue = "ko") String lang) {
        return projectQueryService.getPublished(slug, lang);
    }

    @GetMapping("/api/admin/projects")
    public List<AdminProjectResponse> adminProjects() {
        return projectQueryService.adminList();
    }

    @GetMapping("/api/admin/projects/{id}")
    public AdminProjectResponse adminProject(@PathVariable Long id) {
        return projectQueryService.getAdmin(id);
    }

    @PostMapping("/api/admin/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return projectCommandService.create(request);
    }

    @PutMapping("/api/admin/projects/{id}")
    public AdminProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return projectCommandService.update(id, request);
    }

    @PostMapping("/api/admin/projects/{id}/publish")
    public AdminProjectResponse publish(@PathVariable Long id) {
        return projectCommandService.publish(id);
    }

    @DeleteMapping("/api/admin/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectCommandService.delete(id);
    }
}
