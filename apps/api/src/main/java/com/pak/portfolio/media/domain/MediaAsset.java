package com.pak.portfolio.media.domain;

import com.pak.portfolio.common.domain.BaseEntity;
import com.pak.portfolio.common.domain.LocalizedText;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "media_asset")
public class MediaAsset extends BaseEntity {

    @Column(name = "original_file_name", nullable = false, length = 255)
    private String originalFileName;

    @Column(name = "storage_key", nullable = false, unique = true, length = 255)
    private String storageKey;

    @Column(name = "content_type", nullable = false, length = 120)
    private String contentType;

    @Column(nullable = false)
    private long size;

    @Column(name = "public_url", nullable = false, length = 500)
    private String publicUrl;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "alt_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "alt_en", columnDefinition = "text"))
    })
    private LocalizedText altText;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "caption_ko", columnDefinition = "text")),
            @AttributeOverride(name = "en", column = @Column(name = "caption_en", columnDefinition = "text"))
    })
    private LocalizedText caption;

    protected MediaAsset() {
    }

    public MediaAsset(
            String originalFileName,
            String storageKey,
            String contentType,
            long size,
            String publicUrl,
            LocalizedText altText,
            LocalizedText caption) {
        this.originalFileName = originalFileName;
        this.storageKey = storageKey;
        this.contentType = contentType;
        this.size = size;
        this.publicUrl = publicUrl;
        this.altText = altText;
        this.caption = caption;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSize() {
        return size;
    }

    public String getPublicUrl() {
        return publicUrl;
    }

    public LocalizedText getAltText() {
        return altText;
    }

    public LocalizedText getCaption() {
        return caption;
    }
}
