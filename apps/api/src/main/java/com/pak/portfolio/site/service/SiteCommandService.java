package com.pak.portfolio.site.service;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.site.domain.Achievement;
import com.pak.portfolio.site.domain.ResumeAsset;
import com.pak.portfolio.site.domain.SiteSettings;
import com.pak.portfolio.site.dto.SiteDtos.AdminAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.AdminSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.AchievementRequest;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetRequest;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetResponse;
import com.pak.portfolio.site.dto.SiteDtos.SiteSettingsRequest;
import com.pak.portfolio.site.port.RevalidationPort;
import com.pak.portfolio.site.repository.AchievementRepository;
import com.pak.portfolio.site.repository.ResumeAssetRepository;
import com.pak.portfolio.site.repository.SiteSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SiteCommandService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final AchievementRepository achievementRepository;
    private final ResumeAssetRepository resumeAssetRepository;
    private final SiteQueryService siteQueryService;
    private final RevalidationPort revalidationPort;

    public SiteCommandService(
            SiteSettingsRepository siteSettingsRepository,
            AchievementRepository achievementRepository,
            ResumeAssetRepository resumeAssetRepository,
            SiteQueryService siteQueryService,
            RevalidationPort revalidationPort) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.achievementRepository = achievementRepository;
        this.resumeAssetRepository = resumeAssetRepository;
        this.siteQueryService = siteQueryService;
        this.revalidationPort = revalidationPort;
    }

    public AdminSiteSettingsResponse updateSettings(SiteSettingsRequest request) {
        SiteSettings site = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new NotFoundException("Site settings not found"));
        site.update(
                toLocalized(request.heroTitle()),
                toLocalized(request.heroSubtitle()),
                toLocalized(request.heroDescription()),
                request.contactEmail(),
                request.contactPhone(),
                request.githubUrl(),
                request.linkedInUrl());
        revalidationPort.revalidateAll();
        return siteQueryService.adminSiteSettings();
    }

    public AdminAchievementResponse createAchievement(AchievementRequest request) {
        Achievement achievement = new Achievement(
                toLocalized(request.title()),
                toLocalized(request.summary()),
                request.metric(),
                request.accent());
        achievement.setSortOrder(request.sortOrder());
        achievement.publish();
        revalidationPort.revalidateAll();
        return siteQueryService.toAdminAchievement(achievementRepository.save(achievement));
    }

    public AdminAchievementResponse updateAchievement(Long id, AchievementRequest request) {
        Achievement achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Achievement not found"));
        achievement.update(
                toLocalized(request.title()),
                toLocalized(request.summary()),
                request.metric(),
                request.accent(),
                request.sortOrder());
        revalidationPort.revalidateAll();
        return siteQueryService.toAdminAchievement(achievement);
    }

    public void deleteAchievement(Long id) {
        if (!achievementRepository.existsById(id)) {
            throw new NotFoundException("Achievement not found");
        }
        achievementRepository.deleteById(id);
        revalidationPort.revalidateAll();
    }

    public ResumeAssetResponse upsertResume(ResumeAssetRequest request) {
        ResumeAsset resume = resumeAssetRepository.findByLanguageCode(request.languageCode())
                .orElseGet(() -> new ResumeAsset(
                        request.languageCode(),
                        toLocalized(request.label()),
                        request.fileName(),
                        request.fileUrl()));
        resume.update(toLocalized(request.label()), request.fileName(), request.fileUrl(), request.sortOrder());
        resume.publish();
        ResumeAsset saved = resumeAssetRepository.save(resume);
        revalidationPort.revalidateAll();
        return new ResumeAssetResponse(saved.getId(), saved.getLanguageCode(), saved.getLabel().getKo(), saved.getFileName(), saved.getFileUrl());
    }

    private LocalizedText toLocalized(LocalizedTextPayload payload) {
        return new LocalizedText(payload.ko(), payload.en());
    }
}
