package com.pak.portfolio.experience.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.experience.domain.ExperienceItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceItemRepository extends JpaRepository<ExperienceItem, Long> {

    List<ExperienceItem> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);
}
