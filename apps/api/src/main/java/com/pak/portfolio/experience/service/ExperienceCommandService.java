package com.pak.portfolio.experience.service;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.experience.domain.ExperienceItem;
import com.pak.portfolio.experience.dto.ExperienceDtos.AdminExperienceResponse;
import com.pak.portfolio.experience.dto.ExperienceDtos.ExperienceRequest;
import com.pak.portfolio.experience.repository.ExperienceItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ExperienceCommandService {

    private final ExperienceItemRepository experienceItemRepository;
    private final ExperienceQueryService experienceQueryService;

    public ExperienceCommandService(
            ExperienceItemRepository experienceItemRepository,
            ExperienceQueryService experienceQueryService) {
        this.experienceItemRepository = experienceItemRepository;
        this.experienceQueryService = experienceQueryService;
    }

    public AdminExperienceResponse create(ExperienceRequest request) {
        ExperienceItem item = new ExperienceItem(
                request.companyName(),
                toLocalized(request.roleTitle()),
                toLocalized(request.summary()),
                toLocalized(request.periodLabel()),
                toLocalized(request.highlights()),
                request.stackSummary(),
                request.location());
        item.setSortOrder(request.sortOrder());
        item.publish();
        return experienceQueryService.toAdmin(experienceItemRepository.save(item));
    }

    public AdminExperienceResponse update(Long id, ExperienceRequest request) {
        ExperienceItem item = experienceItemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Experience item not found"));
        item.update(
                request.companyName(),
                toLocalized(request.roleTitle()),
                toLocalized(request.summary()),
                toLocalized(request.periodLabel()),
                toLocalized(request.highlights()),
                request.stackSummary(),
                request.location(),
                request.sortOrder());
        return experienceQueryService.toAdmin(item);
    }

    public void delete(Long id) {
        if (!experienceItemRepository.existsById(id)) {
            throw new NotFoundException("Experience item not found");
        }
        experienceItemRepository.deleteById(id);
    }

    private LocalizedText toLocalized(LocalizedTextPayload payload) {
        return new LocalizedText(payload.ko(), payload.en());
    }
}
