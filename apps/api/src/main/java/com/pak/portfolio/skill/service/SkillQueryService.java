package com.pak.portfolio.skill.service;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.skill.domain.SkillGroup;
import com.pak.portfolio.skill.domain.SkillItem;
import com.pak.portfolio.skill.dto.SkillDtos.AdminSkillGroupResponse;
import com.pak.portfolio.skill.dto.SkillDtos.AdminSkillItemResponse;
import com.pak.portfolio.skill.dto.SkillDtos.PublicSkillGroupResponse;
import com.pak.portfolio.skill.dto.SkillDtos.PublicSkillItemResponse;
import com.pak.portfolio.skill.repository.SkillGroupRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SkillQueryService {

    private final SkillGroupRepository skillGroupRepository;

    public SkillQueryService(SkillGroupRepository skillGroupRepository) {
        this.skillGroupRepository = skillGroupRepository;
    }

    public List<PublicSkillGroupResponse> getPublished(String language) {
        return skillGroupRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                .map(group -> new PublicSkillGroupResponse(
                        group.getGroupKey(),
                        group.getTitle().resolve(language),
                        group.getItems().stream()
                                .map(item -> new PublicSkillItemResponse(
                                        item.getName(),
                                        item.getDescription().resolve(language),
                                        item.getSortOrder()))
                                .toList()))
                .toList();
    }

    public List<AdminSkillGroupResponse> getAdminList() {
        return skillGroupRepository.findAll().stream().map(this::toAdmin).toList();
    }

    AdminSkillGroupResponse toAdmin(SkillGroup group) {
        return new AdminSkillGroupResponse(
                group.getId(),
                group.getGroupKey(),
                new LocalizedTextPayload(group.getTitle().getKo(), group.getTitle().getEn()),
                group.getStatus().name(),
                group.getSortOrder(),
                group.getItems().stream().map(this::toAdminItem).toList());
    }

    private AdminSkillItemResponse toAdminItem(SkillItem item) {
        return new AdminSkillItemResponse(
                item.getId(),
                item.getName(),
                new LocalizedTextPayload(item.getDescription().getKo(), item.getDescription().getEn()),
                item.getSortOrder());
    }
}
