package com.pak.portfolio.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class LocalizedText {

    @Column(columnDefinition = "text")
    private String ko;

    @Column(columnDefinition = "text")
    private String en;

    protected LocalizedText() {
    }

    public LocalizedText(String ko, String en) {
        this.ko = ko;
        this.en = en;
    }

    public String getKo() {
        return ko;
    }

    public String getEn() {
        return en;
    }

    public String resolve(String language) {
        if ("en".equalsIgnoreCase(language) && en != null && !en.isBlank()) {
            return en;
        }
        return ko;
    }
}
