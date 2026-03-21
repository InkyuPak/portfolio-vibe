package com.pak.portfolio.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import java.time.OffsetDateTime;

@MappedSuperclass
public abstract class PublishableEntity extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PublicationStatus status = PublicationStatus.DRAFT;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "published_at")
    private OffsetDateTime publishedAt;

    public PublicationStatus getStatus() {
        return status;
    }

    public void setStatus(PublicationStatus status) {
        this.status = status;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public OffsetDateTime getPublishedAt() {
        return publishedAt;
    }

    public void publish() {
        this.status = PublicationStatus.PUBLISHED;
        this.publishedAt = OffsetDateTime.now();
    }
}
