package com.pak.portfolio.skill.domain;

import com.pak.portfolio.common.domain.BaseEntity;
import com.pak.portfolio.common.domain.LocalizedText;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "skill_item")
public class SkillItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_group_id", nullable = false)
    private SkillGroup skillGroup;

    @Column(nullable = false, length = 120)
    private String name;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "description_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "description_en", columnDefinition = "text"))
    })
    private LocalizedText description;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected SkillItem() {
    }

    public SkillItem(String name, LocalizedText description, int sortOrder) {
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
    }

    void attachTo(SkillGroup skillGroup) {
        this.skillGroup = skillGroup;
    }

    public String getName() {
        return name;
    }

    public LocalizedText getDescription() {
        return description;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
