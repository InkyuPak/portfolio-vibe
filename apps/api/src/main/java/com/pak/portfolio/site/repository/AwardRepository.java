package com.pak.portfolio.site.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Award;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AwardRepository extends JpaRepository<Award, Long> {
    List<Award> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);
}
