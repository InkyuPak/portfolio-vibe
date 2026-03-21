package com.pak.portfolio.skill.service;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.skill.domain.SkillGroup;
import com.pak.portfolio.skill.domain.SkillItem;
import com.pak.portfolio.skill.dto.SkillDtos.AdminSkillGroupResponse;
import com.pak.portfolio.skill.dto.SkillDtos.SkillGroupRequest;
import com.pak.portfolio.skill.repository.SkillGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SkillCommandService {

    private final SkillGroupRepository skillGroupRepository;
    private final SkillQueryService skillQueryService;

    public SkillCommandService(SkillGroupRepository skillGroupRepository, SkillQueryService skillQueryService) {
        this.skillGroupRepository = skillGroupRepository;
        this.skillQueryService = skillQueryService;
    }

    public AdminSkillGroupResponse create(SkillGroupRequest request) {
        SkillGroup group = new SkillGroup(request.groupKey(), toLocalized(request.title()));
        group.setSortOrder(request.sortOrder());
        group.replaceItems(request.items().stream()
                .map(item -> new SkillItem(item.name(), toLocalized(item.description()), item.sortOrder()))
                .toList());
        group.publish();
        return skillQueryService.toAdmin(skillGroupRepository.save(group));
    }

    public AdminSkillGroupResponse update(Long id, SkillGroupRequest request) {
        SkillGroup group = skillGroupRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Skill group not found"));
        group.update(request.groupKey(), toLocalized(request.title()), request.sortOrder());
        group.replaceItems(request.items().stream()
                .map(item -> new SkillItem(item.name(), toLocalized(item.description()), item.sortOrder()))
                .toList());
        group.publish();
        return skillQueryService.toAdmin(group);
    }

    public void delete(Long id) {
        if (!skillGroupRepository.existsById(id)) {
            throw new NotFoundException("Skill group not found");
        }
        skillGroupRepository.deleteById(id);
    }

    private LocalizedText toLocalized(LocalizedTextPayload payload) {
        return new LocalizedText(payload.ko(), payload.en());
    }
}
