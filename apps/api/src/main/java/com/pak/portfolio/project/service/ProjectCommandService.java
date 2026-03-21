package com.pak.portfolio.project.service;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.project.domain.Project;
import com.pak.portfolio.project.domain.ProjectSection;
import com.pak.portfolio.project.domain.ProjectSectionType;
import com.pak.portfolio.project.dto.ProjectDtos.AdminProjectResponse;
import com.pak.portfolio.project.dto.ProjectDtos.ProjectRequest;
import com.pak.portfolio.project.repository.ProjectRepository;
import com.pak.portfolio.site.port.RevalidationPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProjectCommandService {

    private final ProjectRepository projectRepository;
    private final ProjectQueryService projectQueryService;
    private final RevalidationPort revalidationPort;

    public ProjectCommandService(
            ProjectRepository projectRepository,
            ProjectQueryService projectQueryService,
            RevalidationPort revalidationPort) {
        this.projectRepository = projectRepository;
        this.projectQueryService = projectQueryService;
        this.revalidationPort = revalidationPort;
    }

    public AdminProjectResponse create(ProjectRequest request) {
        Project project = new Project(
                request.slug(),
                toLocalized(request.title()),
                toLocalized(request.subtitle()),
                toLocalized(request.overview()),
                toLocalized(request.problem()),
                toLocalized(request.role()),
                toLocalized(request.architecture()),
                toLocalized(request.outcome()),
                request.featured(),
                request.themeColor(),
                request.coverImageUrl());
        project.setSortOrder(request.sortOrder());
        project.replaceSections(request.sections().stream()
                .map(section -> new ProjectSection(
                        ProjectSectionType.valueOf(section.type()),
                        toLocalized(section.title()),
                        section.payload(),
                        section.sortOrder()))
                .toList());
        project.publish();
        Project saved = projectRepository.save(project);
        revalidationPort.revalidateAll();
        return projectQueryService.toAdmin(saved);
    }

    public AdminProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Project not found"));
        project.update(
                request.slug(),
                toLocalized(request.title()),
                toLocalized(request.subtitle()),
                toLocalized(request.overview()),
                toLocalized(request.problem()),
                toLocalized(request.role()),
                toLocalized(request.architecture()),
                toLocalized(request.outcome()),
                request.featured(),
                request.themeColor(),
                request.coverImageUrl(),
                request.sortOrder());
        project.replaceSections(request.sections().stream()
                .map(section -> new ProjectSection(
                        ProjectSectionType.valueOf(section.type()),
                        toLocalized(section.title()),
                        section.payload(),
                        section.sortOrder()))
                .toList());
        revalidationPort.revalidateAll();
        return projectQueryService.toAdmin(project);
    }

    public AdminProjectResponse publish(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Project not found"));
        project.publish();
        revalidationPort.revalidateAll();
        return projectQueryService.toAdmin(project);
    }

    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new NotFoundException("Project not found");
        }
        projectRepository.deleteById(id);
        revalidationPort.revalidateAll();
    }

    private LocalizedText toLocalized(LocalizedTextPayload payload) {
        return new LocalizedText(payload.ko(), payload.en());
    }
}
