package com.pak.portfolio.site.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Education;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);
}
