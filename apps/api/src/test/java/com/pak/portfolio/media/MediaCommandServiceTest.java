package com.pak.portfolio.media;

import com.pak.portfolio.media.dto.MediaDtos.MediaAssetResponse;
import com.pak.portfolio.media.port.StoragePort;
import com.pak.portfolio.media.repository.MediaAssetRepository;
import com.pak.portfolio.media.service.MediaCommandService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MediaCommandServiceTest {

    @Test
    void shouldPersistUploadedMetadata() throws Exception {
        StoragePort storagePort = mock(StoragePort.class);
        MediaAssetRepository repository = mock(MediaAssetRepository.class);
        MediaCommandService service = new MediaCommandService(storagePort, repository);

        when(storagePort.store(any(), any(), any(Long.class), any())).thenReturn(new StoragePort.StoredAsset("asset-key", "http://localhost/asset-key"));
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        MockMultipartFile file = new MockMultipartFile("file", "diagram.png", "image/png", "data".getBytes());
        MediaAssetResponse response = service.upload(file, "다이어그램", "Diagram", "캡션", "Caption");

        assertThat(response.originalFileName()).isEqualTo("diagram.png");
        assertThat(response.publicUrl()).isEqualTo("http://localhost/asset-key");
    }
}
