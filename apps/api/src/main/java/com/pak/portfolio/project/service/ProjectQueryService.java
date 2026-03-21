package com.pak.portfolio.project.service;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.project.domain.Project;
import com.pak.portfolio.project.domain.ProjectSection;
import com.pak.portfolio.project.dto.ProjectDtos.AdminProjectResponse;
import com.pak.portfolio.project.dto.ProjectDtos.AdminProjectSectionResponse;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectDetailResponse;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectSectionResponse;
import com.pak.portfolio.project.dto.ProjectDtos.PublicProjectSummaryResponse;
import com.pak.portfolio.project.repository.ProjectRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProjectQueryService {

    private final ProjectRepository projectRepository;

    public ProjectQueryService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<PublicProjectSummaryResponse> listPublished(String language, boolean featuredOnly) {
        List<Project> items = featuredOnly
                ? projectRepository.findByStatusAndFeaturedOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED, true)
                : projectRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED);
        return items.stream()
                .map(project -> new PublicProjectSummaryResponse(
                        project.getId(),
                        project.getSlug(),
                        project.getTitle().resolve(language),
                        project.getSubtitle().resolve(language),
                        project.getOverview().resolve(language),
                        project.isFeatured(),
                        project.getThemeColor(),
                        project.getCoverImageUrl()))
                .toList();
    }

    public PublicProjectDetailResponse getPublished(String slug, String language) {
        Project project = projectRepository.findBySlugAndStatus(slug, PublicationStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Project not found"));
        return toPublic(project, language);
    }

    public List<AdminProjectResponse> adminList() {
        return projectRepository.findAll().stream().map(this::toAdmin).toList();
    }

    public AdminProjectResponse getAdmin(Long id) {
        return projectRepository.findById(id)
                .map(this::toAdmin)
                .orElseThrow(() -> new NotFoundException("Project not found"));
    }

    AdminProjectResponse toAdmin(Project project) {
        return new AdminProjectResponse(
                project.getId(),
                project.getSlug(),
                new LocalizedTextPayload(project.getTitle().getKo(), project.getTitle().getEn()),
                new LocalizedTextPayload(project.getSubtitle().getKo(), project.getSubtitle().getEn()),
                new LocalizedTextPayload(project.getOverview().getKo(), project.getOverview().getEn()),
                new LocalizedTextPayload(project.getProblem().getKo(), project.getProblem().getEn()),
                new LocalizedTextPayload(project.getRole().getKo(), project.getRole().getEn()),
                new LocalizedTextPayload(project.getArchitecture().getKo(), project.getArchitecture().getEn()),
                new LocalizedTextPayload(project.getOutcome().getKo(), project.getOutcome().getEn()),
                project.isFeatured(),
                project.getThemeColor(),
                project.getCoverImageUrl(),
                project.getStatus().name(),
                project.getSortOrder(),
                project.getSections().stream().map(this::toAdminSection).toList());
    }

    private AdminProjectSectionResponse toAdminSection(ProjectSection section) {
        return new AdminProjectSectionResponse(
                section.getId(),
                section.getSectionType().name(),
                new LocalizedTextPayload(section.getTitle().getKo(), section.getTitle().getEn()),
                section.getPayload(),
                section.getSortOrder());
    }

    private PublicProjectDetailResponse toPublic(Project project, String language) {
        return new PublicProjectDetailResponse(
                project.getId(),
                project.getSlug(),
                project.getTitle().resolve(language),
                project.getSubtitle().resolve(language),
                project.getOverview().resolve(language),
                project.getProblem().resolve(language),
                project.getRole().resolve(language),
                project.getArchitecture().resolve(language),
                project.getOutcome().resolve(language),
                project.isFeatured(),
                project.getThemeColor(),
                project.getCoverImageUrl(),
                project.getSections().stream()
                        .map(section -> new PublicProjectSectionResponse(
                                section.getSectionType().name(),
                                section.getTitle().resolve(language),
                                section.getPayload(),
                                section.getSortOrder()))
                        .toList());
    }
}
