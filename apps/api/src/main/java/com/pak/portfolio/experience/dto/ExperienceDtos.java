package com.pak.portfolio.experience.dto;

import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class ExperienceDtos {

    private ExperienceDtos() {
    }

    public record ExperienceRequest(
            @NotBlank String companyName,
            @NotNull @Valid LocalizedTextPayload roleTitle,
            @NotNull @Valid LocalizedTextPayload summary,
            @NotNull @Valid LocalizedTextPayload periodLabel,
            @NotNull @Valid LocalizedTextPayload highlights,
            @NotBlank String stackSummary,
            String location,
            int sortOrder) {
    }

    public record AdminExperienceResponse(
            Long id,
            String companyName,
            LocalizedTextPayload roleTitle,
            LocalizedTextPayload summary,
            LocalizedTextPayload periodLabel,
            LocalizedTextPayload highlights,
            String stackSummary,
            String location,
            String status,
            int sortOrder) {
    }

    public record PublicExperienceResponse(
            Long id,
            String companyName,
            String roleTitle,
            String summary,
            String periodLabel,
            List<String> highlights,
            String stackSummary,
            String location) {
    }
}
