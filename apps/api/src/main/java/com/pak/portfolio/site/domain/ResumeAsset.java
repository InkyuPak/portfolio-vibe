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
@Table(name = "resume_asset")
public class ResumeAsset extends PublishableEntity {

    @Column(name = "language_code", nullable = false, unique = true, length = 20)
    private String languageCode;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "label_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "label_en", columnDefinition = "text"))
    })
    private LocalizedText label;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    protected ResumeAsset() {
    }

    public ResumeAsset(String languageCode, LocalizedText label, String fileName, String fileUrl) {
        this.languageCode = languageCode;
        this.label = label;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
    }

    public void update(LocalizedText label, String fileName, String fileUrl, int sortOrder) {
        this.label = label;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        setSortOrder(sortOrder);
    }

    public String getLanguageCode() {
        return languageCode;
    }

    public LocalizedText getLabel() {
        return label;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }
}
