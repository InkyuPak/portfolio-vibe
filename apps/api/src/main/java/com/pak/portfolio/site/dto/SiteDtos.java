package com.pak.portfolio.site.dto;

import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class SiteDtos {

    private SiteDtos() {
    }

    public record SiteSettingsRequest(
            @NotNull @Valid LocalizedTextPayload heroTitle,
            @NotNull @Valid LocalizedTextPayload heroSubtitle,
            @NotNull @Valid LocalizedTextPayload heroDescription,
            @NotBlank String contactEmail,
            String contactPhone,
            String githubUrl,
            String linkedInUrl) {
    }

    public record AdminSiteSettingsResponse(
            Long id,
            LocalizedTextPayload heroTitle,
            LocalizedTextPayload heroSubtitle,
            LocalizedTextPayload heroDescription,
            String contactEmail,
            String contactPhone,
            String githubUrl,
            String linkedInUrl) {
    }

    public record PublicSiteSettingsResponse(
            String heroTitle,
            String heroSubtitle,
            String heroDescription,
            String contactEmail,
            String contactPhone,
            String githubUrl,
            String linkedInUrl) {
    }

    public record AchievementRequest(
            @NotNull @Valid LocalizedTextPayload title,
            @NotNull @Valid LocalizedTextPayload summary,
            @NotBlank String metric,
            String accent,
            int sortOrder) {
    }

    public record AdminAchievementResponse(
            Long id,
            LocalizedTextPayload title,
            LocalizedTextPayload summary,
            String metric,
            String accent,
            String status,
            int sortOrder) {
    }

    public record PublicAchievementResponse(String title, String summary, String metric, String accent) {
    }

    public record ResumeAssetRequest(
            @NotBlank String languageCode,
            @NotNull @Valid LocalizedTextPayload label,
            @NotBlank String fileName,
            @NotBlank String fileUrl,
            int sortOrder) {
    }

    public record ResumeAssetResponse(Long id, String languageCode, String label, String fileName, String fileUrl) {
    }

    public record PublicEducationResponse(
            String institutionName,
            String degree,
            String major,
            String periodLabel) {
    }

    public record PublicAwardResponse(
            String awardType,
            String title,
            String issuer,
            String periodLabel,
            String description) {
    }

    public record SiteOverviewResponse(
            PublicSiteSettingsResponse site,
            List<PublicAchievementResponse> achievements,
            List<ResumeAssetResponse> resumes) {
    }
}
