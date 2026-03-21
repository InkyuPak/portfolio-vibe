package com.pak.portfolio.project.domain;

import com.fasterxml.jackson.databind.JsonNode;
import com.pak.portfolio.common.domain.BaseEntity;
import com.pak.portfolio.common.domain.LocalizedText;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "project_section")
public class ProjectSection extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false, length = 30)
    private ProjectSectionType sectionType;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "title_en", columnDefinition = "text"))
    })
    private LocalizedText title;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private JsonNode payload;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected ProjectSection() {
    }

    public ProjectSection(ProjectSectionType sectionType, LocalizedText title, JsonNode payload, int sortOrder) {
        this.sectionType = sectionType;
        this.title = title;
        this.payload = payload;
        this.sortOrder = sortOrder;
    }

    void attachTo(Project project) {
        this.project = project;
    }

    public ProjectSectionType getSectionType() {
        return sectionType;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public JsonNode getPayload() {
        return payload;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
