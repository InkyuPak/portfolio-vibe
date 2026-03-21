package com.pak.portfolio.skill.dto;

import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class SkillDtos {

    private SkillDtos() {
    }

    public record SkillItemRequest(
            @NotBlank String name,
            @NotNull @Valid LocalizedTextPayload description,
            int sortOrder) {
    }

    public record SkillGroupRequest(
            @NotBlank String groupKey,
            @NotNull @Valid LocalizedTextPayload title,
            @NotEmpty List<@Valid SkillItemRequest> items,
            int sortOrder) {
    }

    public record AdminSkillItemResponse(Long id, String name, LocalizedTextPayload description, int sortOrder) {
    }

    public record AdminSkillGroupResponse(
            Long id,
            String groupKey,
            LocalizedTextPayload title,
            String status,
            int sortOrder,
            List<AdminSkillItemResponse> items) {
    }

    public record PublicSkillItemResponse(String name, String description, int sortOrder) {
    }

    public record PublicSkillGroupResponse(String groupKey, String title, List<PublicSkillItemResponse> items) {
    }
}
