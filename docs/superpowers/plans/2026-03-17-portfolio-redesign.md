# Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete visual overhaul to dark-premium purple style + add Education/Award backend entities so the portfolio fully replaces a traditional resume.

**Architecture:** Flyway V2 migration adds `education` and `award` tables inside the existing `site` module (no new Spring Modulith module). Frontend CSS variables are replaced wholesale; every public component is rewritten to the dark premium design. All content is seeded via `DataBootstrap`.

**Tech Stack:** Spring Boot 3.4 / Java 21 / PostgreSQL / Flyway · Next.js 16 / React 19 / TypeScript / Tailwind CSS v4 / Vitest

---

## Chunk 1: Backend — Education & Award (DB → Entity → DTO → Service → Controller → Tests → Seed)

### File map

| Action | File |
|--------|------|
| Create | `apps/api/src/main/resources/db/migration/V2__add_education_award.sql` |
| Create | `apps/api/src/main/java/com/pak/portfolio/site/domain/Education.java` |
| Create | `apps/api/src/main/java/com/pak/portfolio/site/domain/Award.java` |
| Create | `apps/api/src/main/java/com/pak/portfolio/site/repository/EducationRepository.java` |
| Create | `apps/api/src/main/java/com/pak/portfolio/site/repository/AwardRepository.java` |
| Modify | `apps/api/src/main/java/com/pak/portfolio/site/dto/SiteDtos.java` |
| Modify | `apps/api/src/main/java/com/pak/portfolio/site/service/SiteQueryService.java` |
| Modify | `apps/api/src/main/java/com/pak/portfolio/site/controller/SiteController.java` |
| Create | `apps/api/src/test/java/com/pak/portfolio/SiteQueryServiceTest.java` |
| Modify | `apps/api/src/test/java/com/pak/portfolio/PublicApiWebMvcTest.java` |
| Modify | `apps/api/src/main/java/com/pak/portfolio/common/config/DataBootstrap.java` |

---

### Task 1: Flyway V2 migration + Entity classes (must land together — `ddl-auto: validate`)

- [ ] **Step 1: Create the migration file**

`apps/api/src/main/resources/db/migration/V2__add_education_award.sql`

```sql
create table education (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    institution_name varchar(200) not null,
    degree_ko text not null,
    degree_en text,
    major_ko text not null,
    major_en text,
    period_label_ko text not null,
    period_label_en text
);

create table award (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    award_type varchar(50) not null,
    title_ko text not null,
    title_en text,
    issuer_ko text not null,
    issuer_en text,
    period_label varchar(50) not null,
    description_ko text,
    description_en text
);
```

- [ ] **Step 2: Create `Education.java`** — follows exact same pattern as `Achievement.java`

`apps/api/src/main/java/com/pak/portfolio/site/domain/Education.java`

```java
package com.pak.portfolio.site.domain;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublishableEntity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "education")
public class Education extends PublishableEntity {

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "degree_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "degree_en", columnDefinition = "text"))
    })
    private LocalizedText degree;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "major_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "major_en", columnDefinition = "text"))
    })
    private LocalizedText major;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "period_label_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "period_label_en", columnDefinition = "text"))
    })
    private LocalizedText periodLabel;

    protected Education() {}

    public Education(String institutionName, LocalizedText degree, LocalizedText major, LocalizedText periodLabel) {
        this.institutionName = institutionName;
        this.degree = degree;
        this.major = major;
        this.periodLabel = periodLabel;
    }

    public String getInstitutionName() { return institutionName; }
    public LocalizedText getDegree() { return degree; }
    public LocalizedText getMajor() { return major; }
    public LocalizedText getPeriodLabel() { return periodLabel; }
}
```

- [ ] **Step 3: Create `Award.java`** — `periodLabel` is a plain `String` (not `LocalizedText`) — award dates like "2024.04" are non-localized

`apps/api/src/main/java/com/pak/portfolio/site/domain/Award.java`

```java
package com.pak.portfolio.site.domain;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublishableEntity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "award")
public class Award extends PublishableEntity {

    @Column(name = "award_type", nullable = false, length = 50)
    private String awardType;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "title_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "title_en", columnDefinition = "text"))
    })
    private LocalizedText title;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "issuer_ko", columnDefinition = "text", nullable = false)),
            @AttributeOverride(name = "en", column = @Column(name = "issuer_en", columnDefinition = "text"))
    })
    private LocalizedText issuer;

    @Column(name = "period_label", nullable = false, length = 50)
    private String periodLabel;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ko", column = @Column(name = "description_ko", columnDefinition = "text")),
            @AttributeOverride(name = "en", column = @Column(name = "description_en", columnDefinition = "text"))
    })
    private LocalizedText description;

    protected Award() {}

    public Award(String awardType, LocalizedText title, LocalizedText issuer, String periodLabel, LocalizedText description) {
        this.awardType = awardType;
        this.title = title;
        this.issuer = issuer;
        this.periodLabel = periodLabel;
        this.description = description;
    }

    public String getAwardType() { return awardType; }
    public LocalizedText getTitle() { return title; }
    public LocalizedText getIssuer() { return issuer; }
    public String getPeriodLabel() { return periodLabel; }
    public LocalizedText getDescription() { return description; }
}
```

- [ ] **Step 4: Create repositories**

`apps/api/src/main/java/com/pak/portfolio/site/repository/EducationRepository.java`

```java
package com.pak.portfolio.site.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Education;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);
}
```

`apps/api/src/main/java/com/pak/portfolio/site/repository/AwardRepository.java`

```java
package com.pak.portfolio.site.repository;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Award;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AwardRepository extends JpaRepository<Award, Long> {
    List<Award> findByStatusOrderBySortOrderAscIdAsc(PublicationStatus status);
}
```

- [ ] **Step 5: Verify the project still compiles**

```bash
cd apps/api && ./gradlew compileJava
```

Expected: `BUILD SUCCESSFUL`

- [ ] **Step 6: Commit — migration + entities + repos together (Hibernate validate requires both at once)**

```bash
cd apps/api
git add src/main/resources/db/migration/V2__add_education_award.sql \
        src/main/java/com/pak/portfolio/site/domain/Education.java \
        src/main/java/com/pak/portfolio/site/domain/Award.java \
        src/main/java/com/pak/portfolio/site/repository/EducationRepository.java \
        src/main/java/com/pak/portfolio/site/repository/AwardRepository.java
git commit -m "feat(site): add education and award entities with V2 Flyway migration"
```

---

### Task 2: DTOs

- [ ] **Step 1: Add 2 new public response records to `SiteDtos.java`**

In `apps/api/src/main/java/com/pak/portfolio/site/dto/SiteDtos.java`, add after the existing `ResumeAssetResponse` record:

```java
    public record PublicEducationResponse(
            String institutionName,
            String degree,
            String major,
            String periodLabel) {
    }

    public record PublicAwardResponse(
            String awardType,
            String title,
            String issuer,
            String periodLabel,
            String description) {
    }
```

- [ ] **Step 2: Compile**

```bash
cd apps/api && ./gradlew compileJava
```

Expected: `BUILD SUCCESSFUL`

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/main/java/com/pak/portfolio/site/dto/SiteDtos.java
git commit -m "feat(site): add PublicEducationResponse and PublicAwardResponse DTOs"
```

---

### Task 3: Service — write test first, then implement

- [ ] **Step 1: Write failing test `SiteQueryServiceTest`**

`apps/api/src/test/java/com/pak/portfolio/SiteQueryServiceTest.java`

```java
package com.pak.portfolio;

import com.pak.portfolio.common.domain.LocalizedText;
import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.site.domain.Award;
import com.pak.portfolio.site.domain.Education;
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
import com.pak.portfolio.site.repository.AchievementRepository;
import com.pak.portfolio.site.repository.AwardRepository;
import com.pak.portfolio.site.repository.EducationRepository;
import com.pak.portfolio.site.repository.ResumeAssetRepository;
import com.pak.portfolio.site.repository.SiteSettingsRepository;
import com.pak.portfolio.site.service.SiteQueryService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SiteQueryServiceTest {

    @Mock private SiteSettingsRepository siteSettingsRepository;
    @Mock private AchievementRepository achievementRepository;
    @Mock private ResumeAssetRepository resumeAssetRepository;
    @Mock private EducationRepository educationRepository;
    @Mock private AwardRepository awardRepository;

    @InjectMocks private SiteQueryService sut;

    @Test
    void listPublishedEducation_returnsKoreanFields() {
        Education edu = new Education(
                "서울과학기술대학교",
                new LocalizedText("수료", "Completed"),
                new LocalizedText("기계시스템디자인공학과", "Mechanical System Design Engineering"),
                new LocalizedText("2013.03 - 2020.08", "Mar 2013 - Aug 2020"));
        edu.publish();
        when(educationRepository.findByStatusOrderBySortOrderAscIdAsc(eq(PublicationStatus.PUBLISHED)))
                .thenReturn(List.of(edu));

        List<PublicEducationResponse> result = sut.listPublishedEducation("ko");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).institutionName()).isEqualTo("서울과학기술대학교");
        assertThat(result.get(0).degree()).isEqualTo("수료");
        assertThat(result.get(0).major()).isEqualTo("기계시스템디자인공학과");
        assertThat(result.get(0).periodLabel()).isEqualTo("2013.03 - 2020.08");
    }

    @Test
    void listPublishedEducation_returnsEnglishFields() {
        Education edu = new Education(
                "Seoul National University of Science and Technology",
                new LocalizedText("수료", "Completed"),
                new LocalizedText("기계시스템디자인공학과", "Mechanical System Design Engineering"),
                new LocalizedText("2013.03 - 2020.08", "Mar 2013 - Aug 2020"));
        edu.publish();
        when(educationRepository.findByStatusOrderBySortOrderAscIdAsc(eq(PublicationStatus.PUBLISHED)))
                .thenReturn(List.of(edu));

        List<PublicEducationResponse> result = sut.listPublishedEducation("en");

        assertThat(result.get(0).degree()).isEqualTo("Completed");
        assertThat(result.get(0).major()).isEqualTo("Mechanical System Design Engineering");
    }

    @Test
    void listPublishedAwards_returnsCorrectFields() {
        Award award = new Award(
                "PUBLICATION",
                new LocalizedText("한국항공우주학회 2024 춘계학술대회 논문 투고", "KSAS 2024 Spring Conference Paper"),
                new LocalizedText("한국항공우주학회", "Korean Society for Aeronautical and Space Sciences"),
                "2024.04",
                new LocalizedText("UAV 통신 보안 관련 논문", "UAV communication security paper"));
        award.publish();
        when(awardRepository.findByStatusOrderBySortOrderAscIdAsc(eq(PublicationStatus.PUBLISHED)))
                .thenReturn(List.of(award));

        List<PublicAwardResponse> result = sut.listPublishedAwards("ko");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).awardType()).isEqualTo("PUBLICATION");
        assertThat(result.get(0).periodLabel()).isEqualTo("2024.04");
        assertThat(result.get(0).title()).isEqualTo("한국항공우주학회 2024 춘계학술대회 논문 투고");
    }
}
```

- [ ] **Step 2: Run test — expect FAIL (method not found)**

```bash
cd apps/api && ./gradlew test --tests "com.pak.portfolio.SiteQueryServiceTest" 2>&1 | tail -20
```

Expected: compilation error — `listPublishedEducation` / `listPublishedAwards` do not exist yet

- [ ] **Step 3: Update `SiteQueryService` to add the two new methods and inject new repos**

Replace the constructor and add two new methods. Full updated file:

```java
package com.pak.portfolio.site.service;

import com.pak.portfolio.common.domain.PublicationStatus;
import com.pak.portfolio.common.dto.CommonDtos.LocalizedTextPayload;
import com.pak.portfolio.common.error.NotFoundException;
import com.pak.portfolio.site.domain.Achievement;
import com.pak.portfolio.site.domain.SiteSettings;
import com.pak.portfolio.site.dto.SiteDtos.AdminAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.AdminSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicAchievementResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicSiteSettingsResponse;
import com.pak.portfolio.site.dto.SiteDtos.ResumeAssetResponse;
import com.pak.portfolio.site.dto.SiteDtos.SiteOverviewResponse;
import com.pak.portfolio.site.repository.AchievementRepository;
import com.pak.portfolio.site.repository.AwardRepository;
import com.pak.portfolio.site.repository.EducationRepository;
import com.pak.portfolio.site.repository.ResumeAssetRepository;
import com.pak.portfolio.site.repository.SiteSettingsRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SiteQueryService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final AchievementRepository achievementRepository;
    private final ResumeAssetRepository resumeAssetRepository;
    private final EducationRepository educationRepository;
    private final AwardRepository awardRepository;

    public SiteQueryService(
            SiteSettingsRepository siteSettingsRepository,
            AchievementRepository achievementRepository,
            ResumeAssetRepository resumeAssetRepository,
            EducationRepository educationRepository,
            AwardRepository awardRepository) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.achievementRepository = achievementRepository;
        this.resumeAssetRepository = resumeAssetRepository;
        this.educationRepository = educationRepository;
        this.awardRepository = awardRepository;
    }

    public PublicSiteSettingsResponse publicSiteSettings(String language) {
        SiteSettings site = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new NotFoundException("Site settings not found"));
        return new PublicSiteSettingsResponse(
                site.getHeroTitle().resolve(language),
                site.getHeroSubtitle().resolve(language),
                site.getHeroDescription().resolve(language),
                site.getContactEmail(),
                site.getContactPhone(),
                site.getGithubUrl(),
                site.getLinkedInUrl());
    }

    public SiteOverviewResponse overview(String language) {
        return new SiteOverviewResponse(
                publicSiteSettings(language),
                achievementRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                        .map(item -> new PublicAchievementResponse(
                                item.getTitle().resolve(language),
                                item.getSummary().resolve(language),
                                item.getMetric(),
                                item.getAccent()))
                        .toList(),
                resumeAssetRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                        .map(item -> new ResumeAssetResponse(
                                item.getId(),
                                item.getLanguageCode(),
                                item.getLabel().resolve(language),
                                item.getFileName(),
                                item.getFileUrl()))
                        .toList());
    }

    public List<PublicEducationResponse> listPublishedEducation(String language) {
        return educationRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                .map(edu -> new PublicEducationResponse(
                        edu.getInstitutionName(),
                        edu.getDegree().resolve(language),
                        edu.getMajor().resolve(language),
                        edu.getPeriodLabel().resolve(language)))
                .toList();
    }

    public List<PublicAwardResponse> listPublishedAwards(String language) {
        return awardRepository.findByStatusOrderBySortOrderAscIdAsc(PublicationStatus.PUBLISHED).stream()
                .map(award -> new PublicAwardResponse(
                        award.getAwardType(),
                        award.getTitle().resolve(language),
                        award.getIssuer().resolve(language),
                        award.getPeriodLabel(),
                        award.getDescription() != null ? award.getDescription().resolve(language) : null))
                .toList();
    }

    public AdminSiteSettingsResponse adminSiteSettings() {
        SiteSettings site = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new NotFoundException("Site settings not found"));
        return new AdminSiteSettingsResponse(
                site.getId(),
                new LocalizedTextPayload(site.getHeroTitle().getKo(), site.getHeroTitle().getEn()),
                new LocalizedTextPayload(site.getHeroSubtitle().getKo(), site.getHeroSubtitle().getEn()),
                new LocalizedTextPayload(site.getHeroDescription().getKo(), site.getHeroDescription().getEn()),
                site.getContactEmail(),
                site.getContactPhone(),
                site.getGithubUrl(),
                site.getLinkedInUrl());
    }

    public List<AdminAchievementResponse> adminAchievements() {
        return achievementRepository.findAll().stream().map(this::toAdminAchievement).toList();
    }

    public List<ResumeAssetResponse> adminResumes() {
        return resumeAssetRepository.findAll().stream()
                .map(item -> new ResumeAssetResponse(item.getId(), item.getLanguageCode(), item.getLabel().getKo(), item.getFileName(), item.getFileUrl()))
                .toList();
    }

    AdminAchievementResponse toAdminAchievement(Achievement item) {
        return new AdminAchievementResponse(
                item.getId(),
                new LocalizedTextPayload(item.getTitle().getKo(), item.getTitle().getEn()),
                new LocalizedTextPayload(item.getSummary().getKo(), item.getSummary().getEn()),
                item.getMetric(),
                item.getAccent(),
                item.getStatus().name(),
                item.getSortOrder());
    }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd apps/api && ./gradlew test --tests "com.pak.portfolio.SiteQueryServiceTest"
```

Expected: `BUILD SUCCESSFUL`, 3 tests passed

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/main/java/com/pak/portfolio/site/service/SiteQueryService.java \
        apps/api/src/test/java/com/pak/portfolio/SiteQueryServiceTest.java
git commit -m "feat(site): add listPublishedEducation/Awards to SiteQueryService with unit tests"
```

---

### Task 4: Controller endpoints + WebMvcTest

- [ ] **Step 1: Add two GET endpoints to `SiteController.java`**

Add these two methods to `SiteController` (after the existing `publicResume` endpoint):

```java
    @GetMapping("/api/public/education")
    public List<com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse> publicEducation(
            @RequestParam(defaultValue = "ko") String lang) {
        return siteQueryService.listPublishedEducation(lang);
    }

    @GetMapping("/api/public/awards")
    public List<com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse> publicAwards(
            @RequestParam(defaultValue = "ko") String lang) {
        return siteQueryService.listPublishedAwards(lang);
    }
```

Also add the import at the top:
```java
import com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse;
import com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse;
```

- [ ] **Step 2: Add tests for the new endpoints in `PublicApiWebMvcTest.java`**

Add two new test methods:

```java
    @Test
    void shouldRenderEducation() throws Exception {
        when(siteQueryService.listPublishedEducation(anyString())).thenReturn(List.of(
                new com.pak.portfolio.site.dto.SiteDtos.PublicEducationResponse(
                        "서울과학기술대학교", "수료", "기계시스템디자인공학과", "2013.03 - 2020.08")));

        mockMvc.perform(get("/api/public/education").param("lang", "ko"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].institutionName").value("서울과학기술대학교"))
                .andExpect(jsonPath("$[0].degree").value("수료"));
    }

    @Test
    void shouldRenderAwards() throws Exception {
        when(siteQueryService.listPublishedAwards(anyString())).thenReturn(List.of(
                new com.pak.portfolio.site.dto.SiteDtos.PublicAwardResponse(
                        "PUBLICATION", "한국항공우주학회 논문", "한국항공우주학회", "2024.04", "UAV 통신 보안")));

        mockMvc.perform(get("/api/public/awards").param("lang", "ko"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].awardType").value("PUBLICATION"))
                .andExpect(jsonPath("$[0].periodLabel").value("2024.04"));
    }
```

- [ ] **Step 3: Run all WebMvcTests**

```bash
cd apps/api && ./gradlew test --tests "com.pak.portfolio.PublicApiWebMvcTest"
```

Expected: `BUILD SUCCESSFUL`, 4 tests passed

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/main/java/com/pak/portfolio/site/controller/SiteController.java \
        apps/api/src/test/java/com/pak/portfolio/PublicApiWebMvcTest.java
git commit -m "feat(site): add GET /api/public/education and /api/public/awards endpoints"
```

---

### Task 5: DataBootstrap seed

- [ ] **Step 1: Add `EducationRepository` and `AwardRepository` injection + bootstrap methods to `DataBootstrap.java`**

Add field declarations and constructor parameters (add to existing constructor):

```java
    private final EducationRepository educationRepository;
    private final AwardRepository awardRepository;
```

Add to constructor parameter list (keep existing params):
```java
    // ... existing params ...
    EducationRepository educationRepository,
    AwardRepository awardRepository
```

Add to constructor body:
```java
    this.educationRepository = educationRepository;
    this.awardRepository = awardRepository;
```

Add to `run()` method after `bootstrapExperience()`:
```java
        bootstrapEducation();
        bootstrapAwards();
```

Add these two private methods:

```java
    private void bootstrapEducation() {
        if (educationRepository.count() > 0) {
            return;
        }
        Education seoulTech = new Education(
                "서울과학기술대학교",
                text("수료", "Completed"),
                text("기계시스템디자인공학과", "Mechanical System Design Engineering"),
                text("2013.03 - 2020.08", "Mar 2013 - Aug 2020"));
        seoulTech.setSortOrder(1);
        seoulTech.publish();
        educationRepository.save(seoulTech);
    }

    private void bootstrapAwards() {
        if (awardRepository.count() > 0) {
            return;
        }
        awardRepository.saveAll(List.of(
                award("PUBLICATION",
                        text("한국항공우주학회 2024 춘계학술대회 논문 투고",
                                "KSAS 2024 Spring Conference — Paper Submitted"),
                        text("한국항공우주학회", "Korean Society for Aeronautical and Space Sciences"),
                        "2024.04",
                        text("다수 그룹 UAV관제의 통신 보안을 위한 경량 고속의 그룹 암호화 키 관리 시스템",
                                "Lightweight high-speed group encryption key management for multi-group UAV control communication security"),
                        1),
                award("COMPETITION",
                        text("2019 CES 공모전 참가 — 교내 최우수상", "2019 CES Competition — Top University Award"),
                        text("서울과학기술대학교", "Seoul National University of Science and Technology"),
                        "2018.12",
                        text("학교 대표로 CES에 참가해 교내 최우수상 수상. 자동화 로봇 설계 및 프로그래밍 담당.",
                                "Represented the university at CES, received the top internal award. Responsible for automation robot design and programming."),
                        2),
                award("EDUCATION_COURSE",
                        text("[NCIA교육센터] ChatGPT 기술 구현", "[NCIA] ChatGPT Technology Implementation"),
                        text("NCIA교육센터", "NCIA Training Center"),
                        "2024.06",
                        text("자연어 처리 및 언어 생성 모델 이해, 문장 생성 원리, AI 애플리케이션 개발 과정",
                                "Natural language processing, language generation models, and AI application development"),
                        3),
                award("EDUCATION_COURSE",
                        text("[NCIA교육센터] 딥러닝 기반 객체탐지 및 고성능 비전 프레임워크 활용",
                                "[NCIA] Deep Learning Object Detection and High-Performance Vision Frameworks"),
                        text("NCIA교육센터", "NCIA Training Center"),
                        "2024.04",
                        text("객체 탐지 인공지능 모델 설계, CNN/R-CNN/YOLO, 성능 평가 및 딥러닝 프레임워크(PyTorch/mmDetection)",
                                "Object detection model design, CNN/R-CNN/YOLO, performance evaluation, PyTorch and mmDetection"),
                        4),
                award("EDUCATION_COURSE",
                        text("[KEA] 파이썬을 활용한 알고리즘&머신러닝 활용",
                                "[KEA] Algorithms & Machine Learning with Python"),
                        text("한국전기기술인협회(KEA)", "Korea Electrical Engineers Association"),
                        "2024.03",
                        text("SVM, XGBoost, Decision Trees, Random Forest 등 머신러닝 알고리즘 실습 및 데이터 분석",
                                "Hands-on practice with SVM, XGBoost, Decision Trees, Random Forest, and data analysis"),
                        5)));
    }

    private Award award(String awardType, LocalizedText title, LocalizedText issuer,
                        String periodLabel, LocalizedText description, int sortOrder) {
        Award item = new Award(awardType, title, issuer, periodLabel, description);
        item.setSortOrder(sortOrder);
        item.publish();
        return item;
    }
```

Add the necessary imports to `DataBootstrap.java`:
```java
import com.pak.portfolio.site.domain.Award;
import com.pak.portfolio.site.domain.Education;
import com.pak.portfolio.site.repository.AwardRepository;
import com.pak.portfolio.site.repository.EducationRepository;
```

- [ ] **Step 2: Run full backend test suite**

```bash
cd apps/api && ./gradlew check
```

Expected: `BUILD SUCCESSFUL` — all tests pass including ArchUnit

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/main/java/com/pak/portfolio/common/config/DataBootstrap.java
git commit -m "feat(site): seed education and award data in DataBootstrap"
```

---

## Chunk 2: Frontend — Types, API Client, CSS Theme

### File map

| Action | File |
|--------|------|
| Modify | `apps/web/src/lib/api/types.ts` |
| Modify | `apps/web/src/lib/api/server.ts` |
| Modify | `apps/web/src/app/globals.css` |

---

### Task 6: Frontend types and API client

- [ ] **Step 1: Add `PublicEducationResponse` and `PublicAwardResponse` to `types.ts`**

Add after the `PublicSkillGroupResponse` interface:

```typescript
export interface PublicEducationResponse {
  institutionName: string;
  degree: string;
  major: string;
  periodLabel: string;
}

export interface PublicAwardResponse {
  awardType: string;
  title: string;
  issuer: string;
  periodLabel: string;
  description?: string | null;
}
```

- [ ] **Step 2: Add `getEducation` and `getAwards` to `server.ts`**

Add after the `getResumes` function:

```typescript
export function getEducation(locale: "ko" | "en") {
  return apiRequest<PublicEducationResponse[]>(`/api/public/education?lang=${locale}`);
}

export function getAwards(locale: "ko" | "en") {
  return apiRequest<PublicAwardResponse[]>(`/api/public/awards?lang=${locale}`);
}
```

Add imports at the top (add to existing import):
```typescript
import type {
  // ... existing imports ...
  PublicEducationResponse,
  PublicAwardResponse,
} from "@/lib/api/types";
```

- [ ] **Step 3: Run TypeScript check**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/lib/api/types.ts apps/web/src/lib/api/server.ts
git commit -m "feat(web): add education and award API types and server functions"
```

---

### Task 7: CSS theme overhaul

- [ ] **Step 1: Replace `globals.css` entirely**

`apps/web/src/app/globals.css`

```css
@import "tailwindcss";

:root {
  --background: #05050f;
  --foreground: #f9fafb;
  --muted: rgba(249, 250, 251, 0.45);
  --line: rgba(139, 92, 246, 0.15);
  --accent: #8b5cf6;
  --accent-2: #4f46e5;
  --card-bg: rgba(139, 92, 246, 0.05);
  --card-border: rgba(139, 92, 246, 0.14);
  --card-hover-bg: rgba(139, 92, 246, 0.10);
  --card-hover-border: rgba(139, 92, 246, 0.30);
  --shadow: 0 0 40px rgba(124, 58, 237, 0.15);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-body);
  --font-serif: var(--font-display);
  --font-mono: var(--font-mono);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-body), sans-serif;
  font-feature-settings: "liga", "kern";
}

/* Subtle grid overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

::selection {
  background: rgba(139, 92, 246, 0.30);
}

/* Glassmorphism panel */
.glass-panel {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
}

/* Purple gradient text utility */
.text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Rise animation */
.animate-rise {
  animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse dot for "live" indicators */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* Ambient glow blobs */
@keyframes float-blob {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(20px, -20px); }
  66% { transform: translate(-10px, 15px); }
}
```

- [ ] **Step 2: Run the web lint**

```bash
cd apps/web && npm run lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/globals.css
git commit -m "feat(web): replace warm-cream CSS theme with dark premium purple"
```

---

## Chunk 3: Frontend — Component Redesigns

### File map

| Action | File |
|--------|------|
| Modify | `apps/web/src/components/site/public-chrome.tsx` |
| Modify | `apps/web/src/components/site/section-heading.tsx` |
| Modify | `apps/web/src/components/site/project-card.tsx` |
| Modify | `apps/web/src/components/site/experience-timeline.tsx` |
| Modify | `apps/web/src/components/site/skill-grid.tsx` |
| Modify | `apps/web/src/components/site/contact-form.tsx` |
| Modify | `apps/web/src/components/site/public-screens.tsx` |

---

### Task 8: Nav + shell (`public-chrome.tsx`)

- [ ] **Step 1: Replace `public-chrome.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LocaleToggle } from "@/components/locale-toggle";
import { detectLocaleFromPathname, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const shellCopy = {
  ko: {
    tagline: "Spring Boot · Kafka · Docker · AI Infra",
    home: "소개",
    work: "프로젝트",
    experience: "경력",
    contact: "연락",
    liveBadge: "시너지에이아이 재직중",
    footer: "백엔드 시스템, 테스트 프레임워크, 데이터 자동화, AI 확장 가능성을 함께 설계하는 포트폴리오.",
  },
  en: {
    tagline: "Spring Boot · Kafka · Docker · AI Infra",
    home: "About",
    work: "Projects",
    experience: "Experience",
    contact: "Contact",
    liveBadge: "@ Synergy AI",
    footer: "A portfolio focused on backend systems, testing frameworks, data automation, and applied AI delivery.",
  },
} as const;

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = detectLocaleFromPathname(pathname);
  const copy = shellCopy[locale];

  const navItems = [
    { href: "/", label: copy.home },
    { href: "/projects", label: copy.work },
    { href: "/experience", label: copy.experience },
    { href: "/contact", label: copy.contact },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 600, height: 600,
          background: "rgba(139,92,246,0.13)",
          top: -150, right: -150,
          filter: "blur(120px)",
          animation: "float-blob 10s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 400, height: 400,
          background: "rgba(79,70,229,0.09)",
          bottom: 100, left: -100,
          filter: "blur(120px)",
          animation: "float-blob 10s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />

      {/* Nav */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(5,5,15,0.72)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139,92,246,0.10)",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-0 sm:px-8 lg:px-10" style={{ height: 60 }}>
          {/* Logo */}
          <Link href={localizePath("/", locale)} className="flex items-center gap-2">
            <span className="font-sans text-base font-bold tracking-tight text-white">
              pak<span style={{ color: "#8b5cf6" }}>.</span>dev
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-3 lg:flex">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const href = localizePath(item.href, locale);
                const active =
                  pathname === href ||
                  (href !== localizePath("/", locale) && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-white"
                        : "text-white/40 hover:text-white/70",
                    )}
                    style={active ? { color: "#a78bfa" } : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Live badge */}
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: "rgba(52,211,153,0.10)",
                border: "1px solid rgba(52,211,153,0.22)",
                color: "#34d399",
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 6, height: 6,
                  background: "#34d399",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              {copy.liveBadge}
            </div>

            <LocaleToggle />
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 lg:hidden">
            <nav className="flex gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const href = localizePath(item.href, locale);
                const active =
                  pathname === href ||
                  (href !== localizePath("/", locale) && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      active ? "text-white" : "text-white/40",
                    )}
                    style={active ? { color: "#a78bfa" } : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <LocaleToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-24 pt-10 sm:px-8 lg:px-10">
        {children}
      </main>

      <footer style={{ borderTop: "1px solid rgba(139,92,246,0.10)", background: "rgba(139,92,246,0.02)" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="font-sans text-base font-bold text-white">
              pak<span style={{ color: "#8b5cf6" }}>.</span>dev
            </p>
            <p className="mt-1 max-w-xl text-sm leading-6" style={{ color: "rgba(249,250,251,0.35)" }}>
              {copy.footer}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm" style={{ color: "rgba(249,250,251,0.30)" }}>
            <a href="mailto:zzz563214@gmail.com" className="hover:text-white transition-colors">
              zzz563214@gmail.com
            </a>
            <a href="https://github.com/pak-inkyu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/site/public-chrome.tsx
git commit -m "feat(web): redesign nav/shell to dark premium purple style"
```

---

### Task 9: `section-heading.tsx`

- [ ] **Step 1: Replace `section-heading.tsx`**

`apps/web/src/components/site/section-heading.tsx`

```tsx
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  gradient?: boolean;
}

export function SectionHeading({ eyebrow, title, description, center, gradient }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-3", center && "items-center text-center")}>
      {eyebrow && (
        <div className="flex items-center gap-3">
          {!center && (
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.6), transparent)" }}
            />
          )}
          <span
            className="text-[10px] font-semibold uppercase tracking-[4px]"
            style={{ color: "#8b5cf6" }}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={cn(
          "font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
          gradient ? "text-gradient" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.45)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/site/section-heading.tsx
git commit -m "feat(web): redesign SectionHeading to dark premium style"
```

---

### Task 10: `project-card.tsx`

- [ ] **Step 1: Replace `project-card.tsx`**

`apps/web/src/components/site/project-card.tsx`

```tsx
import Link from "next/link";
import type { PublicProjectSummaryResponse } from "@/lib/api/types";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: PublicProjectSummaryResponse;
  locale: Locale;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const accent = project.themeColor ?? "#8b5cf6";
  const href = localizePath(`/projects/${project.slug}`, locale);

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(139,92,246,0.04)",
        border: "1px solid rgba(139,92,246,0.13)",
        boxShadow: `0 0 0 0 ${accent}22`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${accent}22`;
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.28)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.13)";
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Cover image */}
      {project.coverImageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, transparent 40%, rgba(5,5,15,0.8) 100%)` }}
          />
          {project.featured && (
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{ background: `${accent}33`, border: `1px solid ${accent}66`, color: accent }}
            >
              Featured
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="text-lg font-bold leading-tight text-white">{project.title}</h3>
          <p className="mt-1 text-sm" style={{ color: "rgba(249,250,251,0.50)" }}>{project.subtitle}</p>
        </div>
        <p className="flex-1 text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.40)" }}>
          {project.overview}
        </p>
        <div
          className="mt-2 flex items-center gap-2 text-xs font-medium transition-colors"
          style={{ color: accent }}
        >
          케이스 스터디 열기
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/site/project-card.tsx
git commit -m "feat(web): redesign ProjectCard to dark premium style"
```

---

### Task 11: `experience-timeline.tsx`

- [ ] **Step 1: Replace `experience-timeline.tsx`**

`apps/web/src/components/site/experience-timeline.tsx`

```tsx
import type { PublicExperienceResponse } from "@/lib/api/types";

interface ExperienceTimelineProps {
  items: PublicExperienceResponse[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative overflow-hidden rounded-2xl p-6 transition-all duration-200"
          style={{
            background: idx === 0 ? "rgba(139,92,246,0.07)" : "rgba(255,255,255,0.02)",
            border: idx === 0
              ? "1px solid rgba(139,92,246,0.22)"
              : "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* top gradient bar — only on first (current) item */}
          {idx === 0 && (
            <div
              className="absolute left-0 right-0 top-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5, transparent)" }}
            />
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex-1">
              {/* Current badge */}
              {idx === 0 && (
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" }}
                >
                  <span
                    className="inline-block rounded-full"
                    style={{ width: 5, height: 5, background: "#34d399", animation: "pulse-dot 2s infinite" }}
                  />
                  재직중
                </div>
              )}

              {/* Company */}
              <p
                className="mb-1 text-[11px] font-semibold uppercase tracking-[2px]"
                style={{ color: idx === 0 ? "#8b5cf6" : "rgba(249,250,251,0.35)" }}
              >
                {item.companyName}
              </p>

              {/* Role */}
              <h3 className="text-lg font-bold text-white">{item.roleTitle}</h3>

              {/* Period + location */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs"
                  style={{
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.18)",
                    color: "rgba(249,250,251,0.50)",
                  }}
                >
                  {item.periodLabel}
                </span>
                {item.location && (
                  <span className="text-xs" style={{ color: "rgba(249,250,251,0.30)" }}>
                    {item.location}
                  </span>
                )}
              </div>

              {/* Summary */}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.50)" }}>
                {item.summary}
              </p>

              {/* Highlights */}
              {item.highlights.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {item.highlights.map((h, hi) => (
                    <li key={hi} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(249,250,251,0.65)" }}>
                      <span
                        className="mt-[6px] shrink-0 rounded-full"
                        style={{ width: 4, height: 4, background: "#8b5cf6" }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {/* Stack tags */}
              {item.stackSummary && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.stackSummary.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md px-2 py-0.5 text-[11px] font-mono"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.18)",
                        color: "#a5b4fc",
                      }}
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/site/experience-timeline.tsx
git commit -m "feat(web): redesign ExperienceTimeline to dark premium style"
```

---

### Task 12: `skill-grid.tsx`

- [ ] **Step 1: Replace `skill-grid.tsx`**

`apps/web/src/components/site/skill-grid.tsx`

```tsx
import type { PublicSkillGroupResponse } from "@/lib/api/types";

interface SkillGridProps {
  groups: PublicSkillGroupResponse[];
}

export function SkillGrid({ groups }: SkillGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.groupKey}
          className="rounded-2xl p-5 transition-all duration-200"
          style={{
            background: "rgba(139,92,246,0.04)",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          <div className="mb-4">
            <p
              className="mb-1 text-[10px] font-semibold uppercase tracking-[3px]"
              style={{ color: "#8b5cf6" }}
            >
              {group.groupKey}
            </p>
            <h3 className="font-serif text-lg font-bold text-white">{group.title}</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {group.items.map((item) => (
              <li key={item.name} className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">{item.name}</span>
                <span className="text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.40)" }}>
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/site/skill-grid.tsx
git commit -m "feat(web): redesign SkillGrid to dark premium style"
```

---

### Task 13: `contact-form.tsx`

- [ ] **Step 1: Replace `contact-form.tsx`**

`apps/web/src/components/site/contact-form.tsx`

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import type { Locale } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  company: z.string().optional(),
  message: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

const copy = {
  ko: {
    name: "이름", email: "이메일", company: "회사 (선택)", message: "메시지",
    submit: "메시지 보내기", sending: "전송 중...", success: "메시지가 전송되었습니다.",
  },
  en: {
    name: "Name", email: "Email", company: "Company (optional)", message: "Message",
    submit: "Send message", sending: "Sending...", success: "Message sent.",
  },
} as const;

interface ContactFormProps { locale: Locale; apiBase?: string; }

export function ContactForm({ locale, apiBase = "" }: ContactFormProps) {
  const c = copy[locale];
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch(`${apiBase}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(139,92,246,0.18)",
    borderRadius: 10,
    color: "#f9fafb",
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)" }}
      >
        <p className="text-lg font-semibold" style={{ color: "#34d399" }}>{c.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "rgba(249,250,251,0.50)" }}>{c.name}</label>
          <input {...register("name")} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
            onBlur={e => (e.target.style.borderColor = "rgba(139,92,246,0.18)")}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "rgba(249,250,251,0.50)" }}>{c.email}</label>
          <input {...register("email")} type="email" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
            onBlur={e => (e.target.style.borderColor = "rgba(139,92,246,0.18)")}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: "rgba(249,250,251,0.50)" }}>{c.company}</label>
        <input {...register("company")} style={inputStyle}
          onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
          onBlur={e => (e.target.style.borderColor = "rgba(139,92,246,0.18)")}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: "rgba(249,250,251,0.50)" }}>{c.message}</label>
        <textarea {...register("message")} rows={5} style={{ ...inputStyle, resize: "vertical" }}
          onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
          onBlur={e => (e.target.style.borderColor = "rgba(139,92,246,0.18)")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 30px rgba(124,58,237,0.25)" }}
      >
        {isSubmitting ? c.sending : c.submit}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/site/contact-form.tsx
git commit -m "feat(web): redesign ContactForm to dark premium style"
```

---

### Task 14: `public-screens.tsx` — full rewrite

This is the largest change. Replace the entire file.

- [ ] **Step 1: Replace `apps/web/src/components/site/public-screens.tsx`**

```tsx
import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { ProjectBlockRenderer } from "@/components/site/project-block-renderer";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SkillGrid } from "@/components/site/skill-grid";
import {
  getAwards,
  getEducation,
  getExperience,
  getProject,
  getProjects,
  getSiteOverview,
  getSkills,
} from "@/lib/api/server";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import type { PublicAwardResponse, PublicEducationResponse } from "@/lib/api/types";

/* ── i18n copy ─────────────────────────────────────────────── */
const copy = {
  ko: {
    heroEyebrow: "Java Backend Engineer · AI Infra · Drone Systems · MSA",
    heroPrimary: "프로젝트 보기",
    heroSecondary: "연락하기",
    heroDesc1: "시너지에이아이(주)에서 AI 병원 연동 백엔드를 메인 담당으로 개발하며",
    heroDesc2: "5개 병원, 530건의 실제 운영 데이터를 무장애(0건)로 안정 운영 중.",
    heroDesc3: "드론 관제 API, MSA 고도화, LLM 서빙까지 2년 5개월간 폭넓은 백엔드 경험.",
    statExp: "실무 경력",
    statExpSub: "2023.10 → 현재",
    statHospitals: "병원 연동",
    statHospitalsSub: "강북삼성 · 전남대 등",
    statCases: "운영 데이터 처리",
    statCasesSub: "장애 0건 달성",
    statProjects: "주요 프로젝트",
    statProjectsSub: "드론 · AI · MSA",
    bigAchieveTitle: "AI 병원 연동 시스템 — 메인 백엔드 담당",
    bigAchieveDesc: "XML 수신 → 처방 조회 → 리포트 전송까지 병원별 상이한 프로세스를 모두 반영하여 구현. K-medi 과제 강북삼성병원 · 전남대병원 현장 처리 완료. 실제 운영 환경에서 무장애 안정 운영.",
    bigAchieveStatLabel: "운영 장애",
    liveBadge: "시너지에이아이 재직중",
    projectsEyebrow: "대표 프로젝트",
    projectsTitle: "복잡한 흐름을 운영 가능한 시스템으로 바꾼 사례",
    projectsDesc: "테스트 프레임워크, EMR/XML 자동화, MSA 고도화까지 서로 다른 문제를 같은 백엔드 사고로 풀어낸 작업입니다.",
    experienceEyebrow: "경력",
    experienceTitle: "운영 안정성과 구조적 명확성을 남긴 2년 5개월",
    experienceDesc: "서비스 구현, 데이터 파이프라인, 병원 시스템 연동, AI 인프라까지 운영 가능한 형태로 마무리한 경험을 중심으로 정리했습니다.",
    skillsEyebrow: "기술 역량",
    skillsTitle: "Spring Boot 중심으로 데이터, 인프라, AI 연결까지 다룹니다.",
    skillsDesc: "핵심은 스택의 수가 아니라, 복잡한 문제를 실제 운영 가능한 형태로 바꾸는 능력입니다.",
    educationEyebrow: "학력 · 수상 · 자격",
    educationTitle: "학력과 활동 이력",
    educationDesc: "정규 학력 외에도 AI/ML 교육 과정을 이수하고 학술 논문과 공모전 수상 경험이 있습니다.",
    contactEyebrow: "연락",
    contactTitle: "좋은 백엔드 팀, 플랫폼 팀, AI 인프라 팀과 대화하고 싶습니다.",
    contactDesc: "채용 제안, 협업 문의, 프로젝트 논의 모두 환영합니다. 특히 Spring Boot 기반 백엔드와 플랫폼 성격이 강한 포지션을 선호합니다.",
    contactEmail: "이메일",
    contactGithub: "GitHub",
    viewAllProjects: "모든 프로젝트 보기",
    projectsPageEyebrow: "Project Library",
    projectsPageTitle: "케이스 스터디 모음",
    projectsPageDesc: "각 프로젝트는 문제 정의, 맡은 역할, 아키텍처 판단, 운영 결과까지 한 흐름으로 읽히도록 구성했습니다.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "경력 타임라인",
    experiencePageDesc: "실무에서 중요했던 것은 결국 운영 안정성과 구조적 명확성이었습니다.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "좋은 백엔드 팀, 플랫폼 팀과 대화하고 싶습니다.",
    contactPageDesc: "채용 제안, 협업 문의, 프로젝트 논의 모두 환영합니다.",
    backToProjects: "프로젝트 목록으로",
    problem: "Problem",
    role: "Role",
    architecture: "Architecture",
    outcome: "Outcome",
    awardTypeLabels: {
      PUBLICATION: "논문",
      COMPETITION: "수상",
      CERTIFICATION: "자격증",
      EDUCATION_COURSE: "교육",
    } as Record<string, string>,
  },
  en: {
    heroEyebrow: "Java Backend Engineer · AI Infra · Drone Systems · MSA",
    heroPrimary: "View projects",
    heroSecondary: "Contact",
    heroDesc1: "Main backend engineer for AI hospital integrations at Synergy AI,",
    heroDesc2: "processing 530+ live records across 5 hospitals with zero incidents.",
    heroDesc3: "2 years 5 months of backend experience across drones, MSA, and LLM infra.",
    statExp: "Experience",
    statExpSub: "Oct 2023 → present",
    statHospitals: "Hospitals",
    statHospitalsSub: "Integrated & stable",
    statCases: "Live cases",
    statCasesSub: "Zero incidents",
    statProjects: "Projects",
    statProjectsSub: "Drone · AI · MSA",
    bigAchieveTitle: "AI Hospital Integration Backend — Main Engineer",
    bigAchieveDesc: "Unified XML intake, prescription lookup, and report delivery across hospitals with different requirements. Handled K-medi on-site rollouts at two major hospitals. Zero incidents in production.",
    bigAchieveStatLabel: "Production incidents",
    liveBadge: "@ Synergy AI",
    projectsEyebrow: "Featured Work",
    projectsTitle: "Case studies where complexity became an operable system",
    projectsDesc: "Testing frameworks, EMR/XML automation, MSA modernization — different problems, same backend thinking.",
    experienceEyebrow: "Experience",
    experienceTitle: "2 years 5 months of operational stability and structural clarity",
    experienceDesc: "Service development, data pipelines, hospital system integration, AI infra — all delivered in an operable form.",
    skillsEyebrow: "Skills",
    skillsTitle: "Spring Boot core, extended to data, infra, and AI delivery.",
    skillsDesc: "The measure isn't stack breadth but the ability to turn complex problems into production-ready systems.",
    educationEyebrow: "Education · Awards",
    educationTitle: "Education & Recognition",
    educationDesc: "University background plus AI/ML coursework, academic paper, and competition award.",
    contactEyebrow: "Contact",
    contactTitle: "Open to great backend, platform, and AI infra teams.",
    contactDesc: "Open to roles, collaborations, and conversations. Especially interested in platform-oriented Spring Boot positions.",
    contactEmail: "Email",
    contactGithub: "GitHub",
    viewAllProjects: "View all projects",
    projectsPageEyebrow: "Project Library",
    projectsPageTitle: "Case Study Library",
    projectsPageDesc: "Each project is structured as problem → role → architecture → outcome.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "Experience Timeline",
    experiencePageDesc: "Operational stability and structural clarity were what mattered most.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "Open to great backend and platform teams.",
    contactPageDesc: "Open to roles, collaborations, and conversations.",
    backToProjects: "Back to projects",
    problem: "Problem",
    role: "Role",
    architecture: "Architecture",
    outcome: "Outcome",
    awardTypeLabels: {
      PUBLICATION: "Publication",
      COMPETITION: "Award",
      CERTIFICATION: "Certification",
      EDUCATION_COURSE: "Course",
    } as Record<string, string>,
  },
} as const;

/* ── Shared styled bits ─────────────────────────────────────── */
function StatCard({ num, label, sub }: { num: string; label: string; sub: string }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.14)",
      }}
    >
      <div
        className="font-sans text-2xl font-black leading-none"
        style={{
          background: "linear-gradient(135deg, #fff, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {num}
      </div>
      <div className="mt-1.5 text-xs font-medium" style={{ color: "rgba(249,250,251,0.55)" }}>{label}</div>
      <div className="mt-0.5 text-[11px]" style={{ color: "rgba(249,250,251,0.30)" }}>{sub}</div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.3), transparent)" }} />
      <span className="text-[10px] font-semibold uppercase tracking-[4px]" style={{ color: "#4b5563" }}>{label}</span>
      <div className="h-px flex-1" style={{ background: "linear-gradient(270deg, rgba(139,92,246,0.3), transparent)" }} />
    </div>
  );
}

function EducationAwardsSection({
  education,
  awards,
  c,
}: {
  education: PublicEducationResponse[];
  awards: PublicAwardResponse[];
  c: (typeof copy)["ko"];
}) {
  return (
    <section>
      <SectionHeading eyebrow={c.educationEyebrow} title={c.educationTitle} description={c.educationDesc} />
      <div className="flex flex-col gap-4">
        {/* Education */}
        {education.map((edu) => (
          <div
            key={edu.institutionName}
            className="flex flex-col gap-1 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[3px]" style={{ color: "#8b5cf6" }}>Education</p>
              <p className="mt-1 text-base font-bold text-white">{edu.institutionName}</p>
              <p className="text-sm" style={{ color: "rgba(249,250,251,0.50)" }}>{edu.degree} · {edu.major}</p>
            </div>
            <span
              className="self-start rounded-full px-3 py-1 text-xs sm:self-center"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)", color: "rgba(249,250,251,0.45)" }}
            >
              {edu.periodLabel}
            </span>
          </div>
        ))}

        {/* Awards grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award) => (
            <div
              key={award.title}
              className="rounded-2xl p-5 transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: award.awardType === "PUBLICATION" ? "rgba(139,92,246,0.12)" :
                                award.awardType === "COMPETITION" ? "rgba(234,179,8,0.10)" :
                                "rgba(52,211,153,0.08)",
                    border: award.awardType === "PUBLICATION" ? "1px solid rgba(139,92,246,0.25)" :
                            award.awardType === "COMPETITION" ? "1px solid rgba(234,179,8,0.20)" :
                            "1px solid rgba(52,211,153,0.18)",
                    color: award.awardType === "PUBLICATION" ? "#a78bfa" :
                           award.awardType === "COMPETITION" ? "#fbbf24" :
                           "#34d399",
                  }}
                >
                  {c.awardTypeLabels[award.awardType] ?? award.awardType}
                </span>
                <span className="text-xs" style={{ color: "rgba(249,250,251,0.30)" }}>{award.periodLabel}</span>
              </div>
              <p className="text-sm font-semibold leading-snug text-white">{award.title}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(249,250,251,0.40)" }}>{award.issuer}</p>
              {award.description && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.30)" }}>{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   HomeScreen
════════════════════════════════════════════════════════════════ */
export async function HomeScreen({ locale }: { locale: Locale }) {
  const [site, projects, experience, skills, education, awards] = await Promise.all([
    getSiteOverview(locale),
    getProjects(locale, true),
    getExperience(locale),
    getSkills(locale),
    getEducation(locale),
    getAwards(locale),
  ]);

  const c = copy[locale];

  return (
    <>
      {/* ── HERO ── */}
      <section className="flex min-h-[80vh] flex-col justify-center py-12">
        {/* Live badge */}
        <div
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)", color: "#34d399" }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: "#34d399", animation: "pulse-dot 2s infinite" }}
          />
          {c.liveBadge}
        </div>

        {/* Eyebrow */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[4px]" style={{ color: "rgba(249,250,251,0.30)" }}>
          {c.heroEyebrow}
        </p>

        {/* Name */}
        <h1
          className="font-sans text-[clamp(52px,9vw,96px)] font-black leading-[0.92] tracking-[-3px]"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {locale === "ko" ? "박인규" : "Park Inkyu"}
        </h1>
        <h2
          className="mt-3 font-sans text-[clamp(18px,3vw,32px)] font-light tracking-[-0.5px]"
          style={{ color: "rgba(249,250,251,0.45)" }}
        >
          {locale === "ko" ? "Java 백엔드 개발자" : "Java Backend Engineer"}
        </h2>

        {/* Description */}
        <p className="mt-5 max-w-lg text-sm leading-[1.8]" style={{ color: "rgba(249,250,251,0.50)" }}>
          {c.heroDesc1}<br />
          <strong style={{ color: "#e5e7eb", fontWeight: 500 }}>{c.heroDesc2}</strong><br />
          {c.heroDesc3}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localizePath("/projects", locale)}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 30px rgba(124,58,237,0.30)",
            }}
          >
            {c.heroPrimary} →
          </Link>
          <Link
            href={localizePath("/contact", locale)}
            className="rounded-xl px-6 py-3 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(249,250,251,0.70)",
            }}
          >
            {c.heroSecondary}
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard num="2년 5개월" label={c.statExp} sub={c.statExpSub} />
          <StatCard num="5개" label={c.statHospitals} sub={c.statHospitalsSub} />
          <StatCard num="530건+" label={c.statCases} sub={c.statCasesSub} />
          <StatCard num="8+" label={c.statProjects} sub={c.statProjectsSub} />
        </div>

        {/* Big achievement banner */}
        <div
          className="mt-5 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(79,70,229,0.04) 100%)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <div className="text-3xl">🏥</div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{c.bigAchieveTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.50)" }}>
              {c.bigAchieveDesc}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div
              className="font-sans text-3xl font-black"
              style={{
                background: "linear-gradient(135deg, #fff, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              0건
            </div>
            <div className="text-[11px]" style={{ color: "rgba(249,250,251,0.30)" }}>{c.bigAchieveStatLabel}</div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section>
        <SectionHeading eyebrow={c.projectsEyebrow} title={c.projectsTitle} description={c.projectsDesc} />
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
        </div>
        <div className="mt-6 text-center">
          <Link
            href={localizePath("/projects", locale)}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.20)",
              color: "#a78bfa",
            }}
          >
            {c.viewAllProjects} →
          </Link>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section>
        <SectionHeading eyebrow={c.experienceEyebrow} title={c.experienceTitle} description={c.experienceDesc} />
        <ExperienceTimeline items={experience} />
      </section>

      {/* ── SKILLS ── */}
      <section>
        <SectionHeading eyebrow={c.skillsEyebrow} title={c.skillsTitle} description={c.skillsDesc} />
        <SkillGrid groups={skills} />
      </section>

      {/* ── EDUCATION & AWARDS ── */}
      <EducationAwardsSection education={education} awards={awards} c={c} />

      {/* ── CONTACT ── */}
      <section>
        <SectionHeading eyebrow={c.contactEyebrow} title={c.contactTitle} description={c.contactDesc} />
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${site.site.contactEmail}`}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              <span style={{ color: "#8b5cf6" }}>✉</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactEmail}</p>
                <p className="text-sm text-white">{site.site.contactEmail}</p>
              </div>
            </a>
            {site.site.githubUrl && (
              <a
                href={site.site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
              >
                <span style={{ color: "#8b5cf6" }}>⌥</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactGithub}</p>
                  <p className="text-sm text-white">github.com/pak-inkyu</p>
                </div>
              </a>
            )}
          </div>
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ProjectsScreen
════════════════════════════════════════════════════════════════ */
export async function ProjectsScreen({ locale }: { locale: Locale }) {
  const projects = await getProjects(locale, false);
  const c = copy[locale];

  return (
    <section>
      <SectionHeading eyebrow={c.projectsPageEyebrow} title={c.projectsPageTitle} description={c.projectsPageDesc} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ProjectDetailScreen
════════════════════════════════════════════════════════════════ */
export async function ProjectDetailScreen({ locale, slug }: { locale: Locale; slug: string }) {
  const project = await getProject(locale, slug);
  const c = copy[locale];
  const accent = project.themeColor ?? "#8b5cf6";

  return (
    <article className="flex flex-col gap-10">
      {/* Back link */}
      <Link
        href={localizePath("/projects", locale)}
        className="flex w-fit items-center gap-2 text-sm transition-colors hover:-translate-x-1"
        style={{ color: "rgba(249,250,251,0.40)" }}
      >
        ← {c.backToProjects}
      </Link>

      {/* Hero block */}
      <div
        className="overflow-hidden rounded-3xl"
        style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.14)" }}
      >
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[4px]" style={{ color: accent }}>
              Case Study
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">{project.title}</h1>
            <p className="text-sm" style={{ color: "rgba(249,250,251,0.50)" }}>{project.subtitle}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.40)" }}>{project.overview}</p>
          </div>
          {project.coverImageUrl && (
            <div className="aspect-video overflow-hidden lg:aspect-auto">
              <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* 2x2 meta grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: c.problem, content: project.problem },
          { label: c.role, content: project.role },
          { label: c.architecture, content: project.architecture },
          { label: c.outcome, content: project.outcome },
        ].map(({ label, content }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[3px]" style={{ color: accent }}>{label}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.60)" }}>{content}</p>
          </div>
        ))}
      </div>

      {/* Dynamic sections */}
      {project.sections.map((section) => (
        <ProjectBlockRenderer key={section.sortOrder} section={section} locale={locale} />
      ))}
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════
   ExperienceScreen
════════════════════════════════════════════════════════════════ */
export async function ExperienceScreen({ locale }: { locale: Locale }) {
  const [experience, skills] = await Promise.all([getExperience(locale), getSkills(locale)]);
  const c = copy[locale];

  return (
    <>
      <section>
        <SectionHeading eyebrow={c.experiencePageEyebrow} title={c.experiencePageTitle} description={c.experiencePageDesc} />
        <ExperienceTimeline items={experience} />
      </section>
      <section>
        <SectionHeading eyebrow={c.skillsEyebrow} title={c.skillsTitle} description={c.skillsDesc} />
        <SkillGrid groups={skills} />
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ContactScreen
════════════════════════════════════════════════════════════════ */
export async function ContactScreen({ locale }: { locale: Locale }) {
  const site = await getSiteOverview(locale);
  const c = copy[locale];

  return (
    <section>
      <SectionHeading eyebrow={c.contactPageEyebrow} title={c.contactPageTitle} description={c.contactPageDesc} />
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <a
            href={`mailto:${site.site.contactEmail}`}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
          >
            <span style={{ color: "#8b5cf6" }}>✉</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactEmail}</p>
              <p className="text-sm text-white">{site.site.contactEmail}</p>
            </div>
          </a>
          {site.site.githubUrl && (
            <a
              href={site.site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              <span style={{ color: "#8b5cf6" }}>⌥</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactGithub}</p>
                <p className="text-sm text-white">github.com/pak-inkyu</p>
              </div>
            </a>
          )}
        </div>
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Run vitest**

```bash
cd apps/web && npm run test
```

Expected: all existing tests pass

- [ ] **Step 4: Full build check**

```bash
cd apps/web && npm run build
```

Expected: `Route (app)` table shows all routes, no TS errors

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/site/public-screens.tsx
git commit -m "feat(web): full redesign of all public screens to dark premium purple with education/awards section"
```

---

### Task 15: Final verification

- [ ] **Step 1: Full backend test suite**

```bash
cd apps/api && ./gradlew check
```

Expected: `BUILD SUCCESSFUL` — ArchUnit, WebMvcTest, SiteQueryServiceTest all green

- [ ] **Step 2: Full frontend test + build**

```bash
cd apps/web && npm run test && npm run build
```

Expected: all vitest tests pass, Next.js build succeeds

- [ ] **Step 3: Start the stack and do a smoke test**

```bash
# Terminal 1
docker compose up -d postgres minio minio-init
cd apps/api && ./gradlew bootRun

# Terminal 2
cd apps/web && npm run dev
```

Open http://localhost:3000 and verify:
- Dark purple design visible (no warm cream colors)
- Hero shows "박인규" with gradient name, live badge, stat cards, big achievement banner
- Projects section shows dark cards
- Experience section shows 시너지에이아이 and 클로버스튜디오
- Skills section shows dark grouped grid
- Education & Awards section shows 서울과학기술대학교 + 5 awards
- Contact section shows dark form

- [ ] **Step 4: Verify education/awards API endpoints**

```bash
curl "http://localhost:8080/api/public/education?lang=ko" | python3 -m json.tool
curl "http://localhost:8080/api/public/awards?lang=ko" | python3 -m json.tool
```

Expected: JSON arrays with the seeded data

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final portfolio redesign verification complete"
```
