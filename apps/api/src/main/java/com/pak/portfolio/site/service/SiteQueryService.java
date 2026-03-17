package com.pak.portfolio.site.service;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.site.domain.Achievement;
import com.pak.portfolio.site.domain.SiteSettings;
import com.pak.portfolio.site.dto.SiteDtos.AdminAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.AdminSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetResponse;
import com.pak.portfolio.site.dto.SiteDtos.SiteOverviewResponse;
import com.pak.portfolio.site.repository.AchievementRepository;
import com.pak.portfolio.site.repository.AwardRepository;
import com.pak.portfolio.site.repository.EducationRepository;
import com.pak.portfolio.site.repository.ResumeAssetRepository;
import com.pak.portfolio.site.repository.SiteSettingsRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SiteQueryService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final AchievementRepository achievementRepository;
    private final ResumeAssetRepository resumeAssetRepository;
    private final EducationRepository educationRepository;
    private final AwardRepository awardRepository;

    public SiteQueryService(
            SiteSettingsRepository siteSettingsRepository,
            AchievementRepository achievementRepository,
            ResumeAssetRepository resumeAssetRepository,
            EducationRepository educationRepository,
            AwardRepository awardRepository) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.achievementRepository = achievementRepository;
        this.resumeAssetRepository = resumeAssetRepository;
        this.educationRepository = educationRepository;
        this.awardRepository = awardRepository;
    }

    public PublicSiteSettingsResponse publicSiteSettings(String language) {
        SiteSettings site = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new NotFoundException("Site settings not found"));
        return new PublicSiteSettingsResponse(
                site.getHeroTitle().resolve(language),
                site.getHeroSubtitle().resolve(language),
                site.getHeroDescription().resolve(language),
                site.getContactEmail(),
                site.getContactPhone(),
                site.getGithubUrl(),
                site.getLinkedInUrl());
    }

    public SiteOverviewResponse overview(String language) {
        return new SiteOverviewResponse(
                publicSiteSettings(language),
                achievementRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                        .map(item -> new PublicAchievementResponse(
                                item.getTitle().resolve(language),
                                item.getSummary().resolve(language),
                                item.getMetric(),
                                item.getAccent()))
                        .toList(),
                resumeAssetRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                        .map(item -> new ResumeAssetResponse(
                                item.getId(),
                                item.getLanguageCode(),
                                item.getLabel().resolve(language),
                                item.getFileName(),
                                item.getFileUrl()))
                        .toList());
    }

    public List<PublicEducationResponse> listPublishedEducation(String language) {
        return educationRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                .map(edu -> new PublicEducationResponse(
                        edu.getInstitutionName(),
                        edu.getDegree().resolve(language),
                        edu.getMajor().resolve(language),
                        edu.getPeriodLabel().resolve(language)))
                .toList();
    }

    public List<PublicAwardResponse> listPublishedAwards(String language) {
        return awardRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                .map(award -> new PublicAwardResponse(
                        award.getAwardType(),
                        award.getTitle().resolve(language),
                        award.getIssuer().resolve(language),
                        award.getPeriodLabel(),
                        award.getDescription() != null ? award.getDescription().resolve(language) : null))
                .toList();
    }

    public AdminSiteSettingsResponse adminSiteSettings() {
        SiteSettings site = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new NotFoundException("Site settings not found"));
        return new AdminSiteSettingsResponse(
                site.getId(),
                new LocalizedTextPayload(site.getHeroTitle().getKo(), site.getHeroTitle().getEn()),
                new LocalizedTextPayload(site.getHeroSubtitle().getKo(), site.getHeroSubtitle().getEn()),
                new LocalizedTextPayload(site.getHeroDescription().getKo(), site.getHeroDescription().getEn()),
                site.getContactEmail(),
                site.getContactPhone(),
                site.getGithubUrl(),
                site.getLinkedInUrl());
    }

    public List<AdminAchievementResponse> adminAchievements() {
        return achievementRepository.findAll().stream().map(this::toAdminAchievement).toList();
    }

    public List<ResumeAssetResponse> adminResumes() {
        return resumeAssetRepository.findAll().stream()
                .map(item -> new ResumeAssetResponse(item.getId(), item.getLanguageCode(), item.getLabel().getKo(), item.getFileName(), item.getFileUrl()))
                .toList();
    }

    AdminAchievementResponse toAdminAchievement(Achievement item) {
        return new AdminAchievementResponse(
                item.getId(),
                new LocalizedTextPayload(item.getTitle().getKo(), item.getTitle().getEn()),
                new LocalizedTextPayload(item.getSummary().getKo(), item.getSummary().getEn()),
                item.getMetric(),
                item.getAccent(),
                item.getStatus().name(),
                item.getSortOrder());
    }
}
