package com.pak.portfolio.media.dto;

import java.time.OffsetDateTime;

public final class MediaDtos {

    private MediaDtos() {
    }

    public record MediaAssetResponse(
            Long id,
            String originalFileName,
            String contentType,
            long size,
            String publicUrl,
            String altKo,
            String altEn,
            String captionKo,
            String captionEn,
            OffsetDateTime createdAt) {
    }
}
