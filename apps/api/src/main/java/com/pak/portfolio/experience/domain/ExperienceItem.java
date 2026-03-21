package com.pak.portfolio.experience.domain;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublishableEntity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "experience_item")
public class ExperienceItem extends PublishableEntity {

    @Column(name = "company_name", nullable = false, length = 160)
    private String companyName;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "role_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "role_en", columnDefinition = "text"))
    })
    private LocalizedText roleTitle;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "summary_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "summary_en", columnDefinition = "text"))
    })
    private LocalizedText summary;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "period_label_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "period_label_en", columnDefinition = "text"))
    })
    private LocalizedText periodLabel;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "highlights_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "highlights_en", columnDefinition = "text"))
    })
    private LocalizedText highlights;

    @Column(name = "stack_summary", columnDefinition = "text")
    private String stackSummary;

    @Column(length = 160)
    private String location;

    protected ExperienceItem() {
    }

    public ExperienceItem(
            String companyName,
            LocalizedText roleTitle,
            LocalizedText summary,
            LocalizedText periodLabel,
            LocalizedText highlights,
            String stackSummary,
            String location) {
        this.companyName = companyName;
        this.roleTitle = roleTitle;
        this.summary = summary;
        this.periodLabel = periodLabel;
        this.highlights = highlights;
        this.stackSummary = stackSummary;
        this.location = location;
    }

    public void update(
            String companyName,
            LocalizedText roleTitle,
            LocalizedText summary,
            LocalizedText periodLabel,
            LocalizedText highlights,
            String stackSummary,
            String location,
            int sortOrder) {
        this.companyName = companyName;
        this.roleTitle = roleTitle;
        this.summary = summary;
        this.periodLabel = periodLabel;
        this.highlights = highlights;
        this.stackSummary = stackSummary;
        this.location = location;
        setSortOrder(sortOrder);
    }

    public String getCompanyName() {
        return companyName;
    }

    public LocalizedText getRoleTitle() {
        return roleTitle;
    }

    public LocalizedText getSummary() {
        return summary;
    }

    public LocalizedText getPeriodLabel() {
        return periodLabel;
    }

    public LocalizedText getHighlights() {
        return highlights;
    }

    public String getStackSummary() {
        return stackSummary;
    }

    public String getLocation() {
        return location;
    }
}
