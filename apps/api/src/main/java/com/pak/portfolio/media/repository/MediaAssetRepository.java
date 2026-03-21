package com.pak.portfolio.media.repository;

import com.pak.portfolio.media.domain.MediaAsset;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {

    List<MediaAsset> findAllByOrderByCreatedAtDesc();
}
