package com.pak.portfolio.site.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.ResumeAsset;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeAssetRepository extends JpaRepository<ResumeAsset, Long> {

    List<ResumeAsset> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);

    Optional<ResumeAsset> findByLanguageCode(String languageCode);
}
