package com.pak.portfolio.project.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.project.domain.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = "sections")
    Optional<Project> findBySlugAndStatus(String slug, PublicationStatus status);

    @EntityGraph(attributePaths = "sections")
    Optional<Project> findById(Long id);

    @EntityGraph(attributePaths = "sections")
    List<Project> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);

    @EntityGraph(attributePaths = "sections")
    List<Project> findByStatusAndFeaturedOrderBySortOrderAscIdAsc(PublicationStatus status, boolean featured);

    @Override
    @EntityGraph(attributePaths = "sections")
    List<Project> findAll();
}
