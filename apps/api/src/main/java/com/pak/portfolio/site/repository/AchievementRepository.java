package com.pak.portfolio.site.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Achievement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);
}
