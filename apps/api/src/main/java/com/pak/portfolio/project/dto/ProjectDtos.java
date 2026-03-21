package com.pak.portfolio.project.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class ProjectDtos {

    private ProjectDtos() {
    }

    public record ProjectSectionRequest(
            @NotBlank String type,
            @NotNull @Valid LocalizedTextPayload title,
            @NotNull JsonNode payload,
            int sortOrder) {
    }

    public record ProjectRequest(
            @NotBlank String slug,
            @NotNull @Valid LocalizedTextPayload title,
            @NotNull @Valid LocalizedTextPayload subtitle,
            @NotNull @Valid LocalizedTextPayload overview,
            @NotNull @Valid LocalizedTextPayload problem,
            @NotNull @Valid LocalizedTextPayload role,
            @NotNull @Valid LocalizedTextPayload architecture,
            @NotNull @Valid LocalizedTextPayload outcome,
            boolean featured,
            String themeColor,
            String coverImageUrl,
            int sortOrder,
            List<@Valid ProjectSectionRequest> sections) {
    }

    public record AdminProjectSectionResponse(
            Long id,
            String type,
            LocalizedTextPayload title,
            JsonNode payload,
            int sortOrder) {
    }

    public record AdminProjectResponse(
            Long id,
            String slug,
            LocalizedTextPayload title,
            LocalizedTextPayload subtitle,
            LocalizedTextPayload overview,
            LocalizedTextPayload problem,
            LocalizedTextPayload role,
            LocalizedTextPayload architecture,
            LocalizedTextPayload outcome,
            boolean featured,
            String themeColor,
            String coverImageUrl,
            String status,
            int sortOrder,
            List<AdminProjectSectionResponse> sections) {
    }

    public record PublicProjectSummaryResponse(
            Long id,
            String slug,
            String title,
            String subtitle,
            String overview,
            boolean featured,
            String themeColor,
            String coverImageUrl) {
    }

    public record PublicProjectSectionResponse(String type, String title, JsonNode payload, int sortOrder) {
    }

    public record PublicProjectDetailResponse(
            Long id,
            String slug,
            String title,
            String subtitle,
            String overview,
            String problem,
            String role,
            String architecture,
            String outcome,
            boolean featured,
            String themeColor,
            String coverImageUrl,
            List<PublicProjectSectionResponse> sections) {
    }
}
