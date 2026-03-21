package com.pak.portfolio.media.service;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.media.domain.MediaAsset;
import com.pak.portfolio.media.dto.MediaDtos.MediaAssetResponse;
import com.pak.portfolio.media.port.StoragePort;
import com.pak.portfolio.media.repository.MediaAssetRepository;
import java.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class MediaCommandService {

    private final StoragePort storagePort;
    private final MediaAssetRepository mediaAssetRepository;

    public MediaCommandService(StoragePort storagePort, MediaAssetRepository mediaAssetRepository) {
        this.storagePort = storagePort;
        this.mediaAssetRepository = mediaAssetRepository;
    }

    public MediaAssetResponse upload(MultipartFile file, String altKo, String altEn, String captionKo, String captionEn) throws IOException {
        StoragePort.StoredAsset storedAsset = storagePort.store(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                file.getInputStream());
        MediaAsset asset = mediaAssetRepository.save(new MediaAsset(
                file.getOriginalFilename(),
                storedAsset.storageKey(),
                file.getContentType(),
                file.getSize(),
                storedAsset.publicUrl(),
                new LocalizedText(altKo, altEn),
                new LocalizedText(captionKo, captionEn)));
        return new MediaAssetResponse(
                asset.getId(),
                asset.getOriginalFileName(),
                asset.getContentType(),
                asset.getSize(),
                asset.getPublicUrl(),
                asset.getAltText().getKo(),
                asset.getAltText().getEn(),
                asset.getCaption().getKo(),
                asset.getCaption().getEn(),
                asset.getCreatedAt());
    }
}
