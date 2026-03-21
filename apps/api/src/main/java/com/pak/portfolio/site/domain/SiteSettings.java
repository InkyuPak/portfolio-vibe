package com.pak.portfolio.site.domain;

import com.pak.portfolio.common.domain.BaseEntity;
import com.pak.portfolio.common.domain.LocalizedText;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "site_settings")
public class SiteSettings extends BaseEntity {

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "hero_title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "hero_title_en", columnDefinition = "text"))
    })
    private LocalizedText heroTitle;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "hero_subtitle_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "hero_subtitle_en", columnDefinition = "text"))
    })
    private LocalizedText heroSubtitle;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "hero_description_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "hero_description_en", columnDefinition = "text"))
    })
    private LocalizedText heroDescription;

    @Column(name = "contact_email", nullable = false, length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "linked_in_url", length = 255)
    private String linkedInUrl;

    protected SiteSettings() {
    }

    public SiteSettings(
            LocalizedText heroTitle,
            LocalizedText heroSubtitle,
            LocalizedText heroDescription,
            String contactEmail,
            String contactPhone,
            String githubUrl,
            String linkedInUrl) {
        this.heroTitle = heroTitle;
        this.heroSubtitle = heroSubtitle;
        this.heroDescription = heroDescription;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.githubUrl = githubUrl;
        this.linkedInUrl = linkedInUrl;
    }

    public void update(
            LocalizedText heroTitle,
            LocalizedText heroSubtitle,
            LocalizedText heroDescription,
            String contactEmail,
            String contactPhone,
            String githubUrl,
            String linkedInUrl) {
        this.heroTitle = heroTitle;
        this.heroSubtitle = heroSubtitle;
        this.heroDescription = heroDescription;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.githubUrl = githubUrl;
        this.linkedInUrl = linkedInUrl;
    }

    public LocalizedText getHeroTitle() {
        return heroTitle;
    }

    public LocalizedText getHeroSubtitle() {
        return heroSubtitle;
    }

    public LocalizedText getHeroDescription() {
        return heroDescription;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getLinkedInUrl() {
        return linkedInUrl;
    }
}
