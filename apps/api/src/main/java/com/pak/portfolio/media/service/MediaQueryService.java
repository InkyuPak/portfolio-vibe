package com.pak.portfolio.media.service;

import com.pak.portfolio.media.dto.MediaDtos.MediaAssetResponse;
import com.pak.portfolio.media.repository.MediaAssetRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MediaQueryService {

    private final MediaAssetRepository mediaAssetRepository;

    public MediaQueryService(MediaAssetRepository mediaAssetRepository) {
        this.mediaAssetRepository = mediaAssetRepository;
    }

    public List<MediaAssetResponse> list() {
        return mediaAssetRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(asset -> new MediaAssetResponse(
                        asset.getId(),
                        asset.getOriginalFileName(),
                        asset.getContentType(),
                        asset.getSize(),
                        asset.getPublicUrl(),
                        asset.getAltText().getKo(),
                        asset.getAltText().getEn(),
                        asset.getCaption().getKo(),
                        asset.getCaption().getEn(),
                        asset.getCreatedAt()))
                .toList();
    }
}
