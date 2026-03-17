package com.pak.portfolio.site.domain;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublishableEntity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "award")
public class Award extends PublishableEntity {

    @Column(name = "award_type", nullable = false, length = 50)
    private String awardType;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "title_en", columnDefinition = "text"))
    })
    private LocalizedText title;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "issuer_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "issuer_en", columnDefinition = "text"))
    })
    private LocalizedText issuer;

    @Column(name = "period_label", nullable = false, length = 50)
    private String periodLabel;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "description_ko", columnDefinition = "text")),
            @AttributeOverride(name = "en", column = @Column(name = "description_en", columnDefinition = "text"))
    })
    private LocalizedText description;

    protected Award() {}

    public Award(String awardType, LocalizedText title, LocalizedText issuer, String periodLabel, LocalizedText description) {
        this.awardType = awardType;
        this.title = title;
        this.issuer = issuer;
        this.periodLabel = periodLabel;
        this.description = description;
    }

    public String getAwardType() { return awardType; }
    public LocalizedText getTitle() { return title; }
    public LocalizedText getIssuer() { return issuer; }
    public String getPeriodLabel() { return periodLabel; }
    public LocalizedText getDescription() { return description; }
}
