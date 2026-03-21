package com.pak.portfolio.project.domain;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublishableEntity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
public class Project extends PublishableEntity {

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "title_en", columnDefinition = "text"))
    })
    private LocalizedText title;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "subtitle_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "subtitle_en", columnDefinition = "text"))
    })
    private LocalizedText subtitle;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "overview_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "overview_en", columnDefinition = "text"))
    })
    private LocalizedText overview;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "problem_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "problem_en", columnDefinition = "text"))
    })
    private LocalizedText problem;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "role_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "role_en", columnDefinition = "text"))
    })
    private LocalizedText role;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "architecture_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "architecture_en", columnDefinition = "text"))
    })
    private LocalizedText architecture;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "outcome_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "outcome_en", columnDefinition = "text"))
    })
    private LocalizedText outcome;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "theme_color", length = 30)
    private String themeColor;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder asc, id asc")
    private List<ProjectSection> sections = new ArrayList<>();

    protected Project() {
    }

    public Project(
            String slug,
            LocalizedText title,
            LocalizedText subtitle,
            LocalizedText overview,
            LocalizedText problem,
            LocalizedText role,
            LocalizedText architecture,
            LocalizedText outcome,
            boolean featured,
            String themeColor,
            String coverImageUrl) {
        this.slug = slug;
        this.title = title;
        this.subtitle = subtitle;
        this.overview = overview;
        this.problem = problem;
        this.role = role;
        this.architecture = architecture;
        this.outcome = outcome;
        this.featured = featured;
        this.themeColor = themeColor;
        this.coverImageUrl = coverImageUrl;
    }

    public void update(
            String slug,
            LocalizedText title,
            LocalizedText subtitle,
            LocalizedText overview,
            LocalizedText problem,
            LocalizedText role,
            LocalizedText architecture,
            LocalizedText outcome,
            boolean featured,
            String themeColor,
            String coverImageUrl,
            int sortOrder) {
        this.slug = slug;
        this.title = title;
        this.subtitle = subtitle;
        this.overview = overview;
        this.problem = problem;
        this.role = role;
        this.architecture = architecture;
        this.outcome = outcome;
        this.featured = featured;
        this.themeColor = themeColor;
        this.coverImageUrl = coverImageUrl;
        setSortOrder(sortOrder);
    }

    public void replaceSections(List<ProjectSection> newSections) {
        sections.clear();
        newSections.forEach(this::addSection);
    }

    private void addSection(ProjectSection section) {
        section.attachTo(this);
        sections.add(section);
    }

    public String getSlug() {
        return slug;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public LocalizedText getSubtitle() {
        return subtitle;
    }

    public LocalizedText getOverview() {
        return overview;
    }

    public LocalizedText getProblem() {
        return problem;
    }

    public LocalizedText getRole() {
        return role;
    }

    public LocalizedText getArchitecture() {
        return architecture;
    }

    public LocalizedText getOutcome() {
        return outcome;
    }

    public boolean isFeatured() {
        return featured;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public List<ProjectSection> getSections() {
        return sections;
    }
}
