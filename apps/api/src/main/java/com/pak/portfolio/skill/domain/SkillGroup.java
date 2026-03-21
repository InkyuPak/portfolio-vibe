package com.pak.portfolio.skill.domain;

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
@Table(name = "skill_group")
public class SkillGroup extends PublishableEntity {

    @Column(name = "group_key", nullable = false, unique = true, length = 100)
    private String groupKey;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "title_en", columnDefinition = "text"))
    })
    private LocalizedText title;

    @OneToMany(mappedBy = "skillGroup", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder asc, id asc")
    private List<SkillItem> items = new ArrayList<>();

    protected SkillGroup() {
    }

    public SkillGroup(String groupKey, LocalizedText title) {
        this.groupKey = groupKey;
        this.title = title;
    }

    public void update(String groupKey, LocalizedText title, int sortOrder) {
        this.groupKey = groupKey;
        this.title = title;
        setSortOrder(sortOrder);
    }

    public void replaceItems(List<SkillItem> newItems) {
        items.clear();
        newItems.forEach(this::addItem);
    }

    public void addItem(SkillItem item) {
        item.attachTo(this);
        items.add(item);
    }

    public String getGroupKey() {
        return groupKey;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public List<SkillItem> getItems() {
        return items;
    }
}
