package com.pak.portfolio.experience.service;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.experience.domain.ExperienceItem;
import com.pak.portfolio.experience.dto.ExperienceDtos.AdminExperienceResponse;
import com.pak.portfolio.experience.dto.ExperienceDtos.PublicExperienceResponse;
import com.pak.portfolio.experience.repository.ExperienceItemRepository;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ExperienceQueryService {

    private final ExperienceItemRepository experienceItemRepository;

    public ExperienceQueryService(ExperienceItemRepository experienceItemRepository) {
        this.experienceItemRepository = experienceItemRepository;
    }

    public List<PublicExperienceResponse> getPublished(String language) {
        return experienceItemRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                .map(item -> new PublicExperienceResponse(
                        item.getId(),
                        item.getCompanyName(),
                        item.getRoleTitle().resolve(language),
                        item.getSummary().resolve(language),
                        item.getPeriodLabel().resolve(language),
                        Arrays.stream(item.getHighlights().resolve(language).split("\\n"))
                                .map(String::trim)
                                .filter(value -> !value.isBlank())
                                .toList(),
                        item.getStackSummary(),
                        item.getLocation()))
                .toList();
    }

    public List<AdminExperienceResponse> getAdminList() {
        return experienceItemRepository.findAll().stream().map(this::toAdmin).toList();
    }

    AdminExperienceResponse toAdmin(ExperienceItem item) {
        return new AdminExperienceResponse(
                item.getId(),
                item.getCompanyName(),
                new LocalizedTextPayload(item.getRoleTitle().getKo(), item.getRoleTitle().getEn()),
                new LocalizedTextPayload(item.getSummary().getKo(), item.getSummary().getEn()),
                new LocalizedTextPayload(item.getPeriodLabel().getKo(), item.getPeriodLabel().getEn()),
                new LocalizedTextPayload(item.getHighlights().getKo(), item.getHighlights().getEn()),
                item.getStackSummary(),
                item.getLocation(),
                item.getStatus().name(),
                item.getSortOrder());
    }
}
