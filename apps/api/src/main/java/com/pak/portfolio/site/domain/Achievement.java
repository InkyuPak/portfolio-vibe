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
@Table(name = "achievement")
public class Achievement extends PublishableEntity {

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "title_en", columnDefinition = "text"))
    })
    private LocalizedText title;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "summary_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "summary_en", columnDefinition = "text"))
    })
    private LocalizedText summary;

    @Column(nullable = false, length = 100)
    private String metric;

    @Column(length = 50)
    private String accent;

    protected Achievement() {
    }

    public Achievement(LocalizedText title, LocalizedText summary, String metric, String accent) {
        this.title = title;
        this.summary = summary;
        this.metric = metric;
        this.accent = accent;
    }

    public void update(LocalizedText title, LocalizedText summary, String metric, String accent, int sortOrder) {
        this.title = title;
        this.summary = summary;
        this.metric = metric;
        this.accent = accent;
        setSortOrder(sortOrder);
    }

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getSummary() {
        return summary;
    }

    public String getMetric() {
        return metric;
    }

    public String getAccent() {
        return accent;
    }
}
