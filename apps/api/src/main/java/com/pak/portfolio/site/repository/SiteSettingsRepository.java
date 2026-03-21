package com.pak.portfolio.site.repository;

import com.pak.portfolio.site.domain.SiteSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {

    Optional<SiteSettings> findFirstByOrderByIdAsc();
}
