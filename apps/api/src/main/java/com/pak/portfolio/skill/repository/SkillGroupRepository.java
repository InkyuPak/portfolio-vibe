package com.pak.portfolio.skill.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.skill.domain.SkillGroup;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillGroupRepository extends JpaRepository<SkillGroup, Long> {

    @EntityGraph(attributePaths = "items")
    List<SkillGroup> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);

    @Override
    @EntityGraph(attributePaths = "items")
    List<SkillGroup> findAll();
}
