package com.pak.portfolio.site.controller;

import com.pak.portfolio.site.dto.SiteDtos.AdminAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.AdminSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.AchievementRequest;
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetRequest;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetResponse;
import com.pak.portfolio.site.dto.SiteDtos.SiteOverviewResponse;
import com.pak.portfolio.site.dto.SiteDtos.SiteSettingsRequest;
import com.pak.portfolio.site.service.SiteCommandService;
import com.pak.portfolio.site.service.SiteQueryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SiteController {

    private final SiteQueryService siteQueryService;
    private final SiteCommandService siteCommandService;

    public SiteController(SiteQueryService siteQueryService, SiteCommandService siteCommandService) {
        this.siteQueryService = siteQueryService;
        this.siteCommandService = siteCommandService;
    }

    @GetMapping("/api/public/site-settings")
    public SiteOverviewResponse overview(@RequestParam(defaultValue = "ko") String lang) {
        return siteQueryService.overview(lang);
    }

    @GetMapping("/api/public/resume")
    public List<ResumeAssetResponse> publicResume(@RequestParam(defaultValue = "ko") String lang) {
        return siteQueryService.overview(lang).resumes();
    }

    @GetMapping("/api/admin/site-settings")
    public AdminSiteSettingsResponse adminSettings() {
        return siteQueryService.adminSiteSettings();
    }

    @PutMapping("/api/admin/site-settings")
    public AdminSiteSettingsResponse updateSettings(@Valid @RequestBody SiteSettingsRequest request) {
        return siteCommandService.updateSettings(request);
    }

    @GetMapping("/api/admin/achievements")
    public List<AdminAchievementResponse> adminAchievements() {
        return siteQueryService.adminAchievements();
    }

    @PostMapping("/api/admin/achievements")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminAchievementResponse createAchievement(@Valid @RequestBody AchievementRequest request) {
        return siteCommandService.createAchievement(request);
    }

    @PutMapping("/api/admin/achievements/{id}")
    public AdminAchievementResponse updateAchievement(@PathVariable Long id, @Valid @RequestBody AchievementRequest request) {
        return siteCommandService.updateAchievement(id, request);
    }

    @DeleteMapping("/api/admin/achievements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAchievement(@PathVariable Long id) {
        siteCommandService.deleteAchievement(id);
    }

    @GetMapping("/api/admin/resume")
    public List<ResumeAssetResponse> adminResumes() {
        return siteQueryService.adminResumes();
    }

    @PostMapping("/api/admin/resume")
    public ResumeAssetResponse upsertResume(@Valid @RequestBody ResumeAssetRequest request) {
        return siteCommandService.upsertResume(request);
    }

    @GetMapping("/api/public/education")
    public List<PublicEducationResponse> publicEducation(
            @RequestParam(defaultValue = "ko") String lang) {
        return siteQueryService.listPublishedEducation(lang);
    }

    @GetMapping("/api/public/awards")
    public List<PublicAwardResponse> publicAwards(
            @RequestParam(defaultValue = "ko") String lang) {
        return siteQueryService.listPublishedAwards(lang);
    }
}
