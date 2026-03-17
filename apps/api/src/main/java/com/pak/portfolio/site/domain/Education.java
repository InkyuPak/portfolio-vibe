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
@Table(name = "education")
public class Education extends PublishableEntity {

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "degree_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "degree_en", columnDefinition = "text"))
    })
    private LocalizedText degree;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "major_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "major_en", columnDefinition = "text"))
    })
    private LocalizedText major;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "period_label_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "period_label_en", columnDefinition = "text"))
    })
    private LocalizedText periodLabel;

    protected Education() {}

    public Education(String institutionName, LocalizedText degree, LocalizedText major, LocalizedText periodLabel) {
        this.institutionName = institutionName;
        this.degree = degree;
        this.major = major;
        this.periodLabel = periodLabel;
    }

    public String getInstitutionName() { return institutionName; }
    public LocalizedText getDegree() { return degree; }
    public LocalizedText getMajor() { return major; }
    public LocalizedText getPeriodLabel() { return periodLabel; }
}
