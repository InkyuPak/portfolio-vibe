# Project Context Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프로젝트 카드와 상세 페이지에 "어디서 한 프로젝트인지" 뱃지(회사명 / 팀 프로젝트)를 표시한다.

**Architecture:** `project` 테이블에 nullable `context_label VARCHAR(100)` 컬럼 추가. 백엔드 DTO 전파 → 프론트 타입 → 카드/상세 UI 렌더링. 어드민 폼에도 입력 필드 추가.

**Tech Stack:** Spring Boot (Java), Flyway, Next.js App Router, TypeScript, Tailwind CSS v4

---

## Files to Modify / Create

| File | Action |
|---|---|
| `apps/api/src/main/resources/db/migration/V7__add_project_context_label.sql` | Create |
| `apps/api/src/main/java/com/pak/portfolio/project/domain/Project.java` | Modify |
| `apps/api/src/main/java/com/pak/portfolio/project/dto/ProjectDtos.java` | Modify |
| `apps/api/src/main/java/com/pak/portfolio/project/service/ProjectQueryService.java` | Modify |
| `apps/api/src/main/java/com/pak/portfolio/project/service/ProjectCommandService.java` | Modify |
| `apps/web/src/lib/api/types.ts` | Modify |
| `apps/web/src/components/site/project-card.tsx` | Modify |
| `apps/web/src/components/site/public-screens.tsx` | Modify |
| `apps/web/src/components/admin/project-studio.tsx` | Modify |

---

## Task 1: Flyway 마이그레이션

**Files:**
- Create: `apps/api/src/main/resources/db/migration/V7__add_project_context_label.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```sql
ALTER TABLE project ADD COLUMN context_label VARCHAR(100);

UPDATE project SET context_label = '시너지에이아이'
WHERE slug IN ('hospital-integration-test-framework', 'hospital-integration-automation');

UPDATE project SET context_label = '클로버스튜디오'
WHERE slug IN ('crowd-analysis-vision-system', 'msa-observability-upgrade');

UPDATE project SET context_label = '팀 프로젝트 · 2인'
WHERE slug IN ('rfp-hunter', 'adsync-engine');
```

- [ ] **Step 2: 커밋**

```bash
git add apps/api/src/main/resources/db/migration/V7__add_project_context_label.sql
git commit -m "db: project context_label 컬럼 추가 및 기존 데이터 설정"
```

---

## Task 2: 백엔드 — Project 엔티티

**Files:**
- Modify: `apps/api/src/main/java/com/pak/portfolio/project/domain/Project.java`

- [ ] **Step 1: `contextLabel` 필드 추가**

`@Column(name = "cover_image_url", length = 500)` 아래에 추가:

```java
@Column(name = "context_label", length = 100)
private String contextLabel;
```

- [ ] **Step 2: 생성자에 `contextLabel` 파라미터 추가**

기존 생성자 시그니처:
```java
public Project(
        String slug,
        LocalizedText title,
        LocalizedText subtitle,
        LocalizedText overview,
        LocalizedText problem,
        LocalizedText role,
        LocalizedText architecture,
        LocalizedText outcome,
        boolean featured,
        String themeColor,
        String coverImageUrl) {
```

변경 후:
```java
public Project(
        String slug,
        LocalizedText title,
        LocalizedText subtitle,
        LocalizedText overview,
        LocalizedText problem,
        LocalizedText role,
        LocalizedText architecture,
        LocalizedText outcome,
        boolean featured,
        String themeColor,
        String coverImageUrl,
        String contextLabel) {
    this.slug = slug;
    this.title = title;
    this.subtitle = subtitle;
    this.overview = overview;
    this.problem = problem;
    this.role = role;
    this.architecture = architecture;
    this.outcome = outcome;
    this.featured = featured;
    this.themeColor = themeColor;
    this.coverImageUrl = coverImageUrl;
    this.contextLabel = contextLabel;
}
```

- [ ] **Step 3: `update()` 메서드에 `contextLabel` 파라미터 추가**

기존 `update()` 시그니처 마지막 파라미터 `int sortOrder` 앞에 `String contextLabel` 추가:

```java
public void update(
        String slug,
        LocalizedText title,
        LocalizedText subtitle,
        LocalizedText overview,
        LocalizedText problem,
        LocalizedText role,
        LocalizedText architecture,
        LocalizedText outcome,
        boolean featured,
        String themeColor,
        String coverImageUrl,
        String contextLabel,
        int sortOrder) {
    this.slug = slug;
    this.title = title;
    this.subtitle = subtitle;
    this.overview = overview;
    this.problem = problem;
    this.role = role;
    this.architecture = architecture;
    this.outcome = outcome;
    this.featured = featured;
    this.themeColor = themeColor;
    this.coverImageUrl = coverImageUrl;
    this.contextLabel = contextLabel;
    setSortOrder(sortOrder);
}
```

- [ ] **Step 4: getter 추가** (`getCoverImageUrl()` 아래에)

```java
public String getContextLabel() {
    return contextLabel;
}
```

- [ ] **Step 5: 빌드 확인**

```bash
cd apps/api && ./gradlew compileJava
```

Expected: BUILD SUCCESSFUL

- [ ] **Step 6: 커밋**

```bash
git add apps/api/src/main/java/com/pak/portfolio/project/domain/Project.java
git commit -m "feat(api): Project 엔티티에 contextLabel 필드 추가"
```

---

## Task 3: 백엔드 — DTOs 업데이트

**Files:**
- Modify: `apps/api/src/main/java/com/pak/portfolio/project/dto/ProjectDtos.java`

- [ ] **Step 1: `ProjectRequest` record에 `contextLabel` 추가**

`String coverImageUrl` 다음 줄에:
```java
String contextLabel,
```

최종 형태:
```java
public record ProjectRequest(
        @NotBlank String slug,
        @NotNull @Valid LocalizedTextPayload title,
        @NotNull @Valid LocalizedTextPayload subtitle,
        @NotNull @Valid LocalizedTextPayload overview,
        @NotNull @Valid LocalizedTextPayload problem,
        @NotNull @Valid LocalizedTextPayload role,
        @NotNull @Valid LocalizedTextPayload architecture,
        @NotNull @Valid LocalizedTextPayload outcome,
        boolean featured,
        String themeColor,
        String coverImageUrl,
        String contextLabel,
        int sortOrder,
        List<@Valid ProjectSectionRequest> sections) {
}
```

- [ ] **Step 2: `AdminProjectResponse` record에 `contextLabel` 추가**

`String coverImageUrl` 다음 줄에:
```java
String contextLabel,
```

최종 형태:
```java
public record AdminProjectResponse(
        Long id,
        String slug,
        LocalizedTextPayload title,
        LocalizedTextPayload subtitle,
        LocalizedTextPayload overview,
        LocalizedTextPayload problem,
        LocalizedTextPayload role,
        LocalizedTextPayload architecture,
        LocalizedTextPayload outcome,
        boolean featured,
        String themeColor,
        String coverImageUrl,
        String contextLabel,
        String status,
        int sortOrder,
        List<AdminProjectSectionResponse> sections) {
}
```

- [ ] **Step 3: `PublicProjectSummaryResponse` record에 `contextLabel` 추가**

```java
public record PublicProjectSummaryResponse(
        Long id,
        String slug,
        String title,
        String subtitle,
        String overview,
        boolean featured,
        String themeColor,
        String coverImageUrl,
        String contextLabel) {
}
```

- [ ] **Step 4: `PublicProjectDetailResponse` record에 `contextLabel` 추가**

```java
public record PublicProjectDetailResponse(
        Long id,
        String slug,
        String title,
        String subtitle,
        String overview,
        String problem,
        String role,
        String architecture,
        String outcome,
        boolean featured,
        String themeColor,
        String coverImageUrl,
        String contextLabel,
        List<PublicProjectSectionResponse> sections) {
}
```

- [ ] **Step 5: 빌드 확인 (컴파일 에러 예상 — 서비스 수정 전)**

```bash
cd apps/api && ./gradlew compileJava 2>&1 | head -40
```

Expected: 컴파일 에러 (서비스 매핑에서 record 인자 수 불일치) — 다음 Task에서 수정

---

## Task 4: 백엔드 — 서비스 매핑 업데이트

**Files:**
- Modify: `apps/api/src/main/java/com/pak/portfolio/project/service/ProjectQueryService.java`
- Modify: `apps/api/src/main/java/com/pak/portfolio/project/service/ProjectCommandService.java`

- [ ] **Step 1: `ProjectQueryService.listPublished()` — PublicProjectSummaryResponse 생성자 업데이트**

`PublicProjectSummaryResponse` 생성자 호출에 `contextLabel` 추가:
```java
return items.stream()
        .map(project -> new PublicProjectSummaryResponse(
                project.getId(),
                project.getSlug(),
                project.getTitle().resolve(language),
                project.getSubtitle().resolve(language),
                project.getOverview().resolve(language),
                project.isFeatured(),
                project.getThemeColor(),
                project.getCoverImageUrl(),
                project.getContextLabel()))
        .toList();
```

- [ ] **Step 2: `ProjectQueryService.toAdmin()` — AdminProjectResponse 생성자 업데이트**

```java
AdminProjectResponse toAdmin(Project project) {
    return new AdminProjectResponse(
            project.getId(),
            project.getSlug(),
            new LocalizedTextPayload(project.getTitle().getKo(), project.getTitle().getEn()),
            new LocalizedTextPayload(project.getSubtitle().getKo(), project.getSubtitle().getEn()),
            new LocalizedTextPayload(project.getOverview().getKo(), project.getOverview().getEn()),
            new LocalizedTextPayload(project.getProblem().getKo(), project.getProblem().getEn()),
            new LocalizedTextPayload(project.getRole().getKo(), project.getRole().getEn()),
            new LocalizedTextPayload(project.getArchitecture().getKo(), project.getArchitecture().getEn()),
            new LocalizedTextPayload(project.getOutcome().getKo(), project.getOutcome().getEn()),
            project.isFeatured(),
            project.getThemeColor(),
            project.getCoverImageUrl(),
            project.getContextLabel(),
            project.getStatus().name(),
            project.getSortOrder(),
            project.getSections().stream().map(this::toAdminSection).toList());
}
```

- [ ] **Step 3: `ProjectQueryService.toPublic()` — PublicProjectDetailResponse 생성자 업데이트**

```java
private PublicProjectDetailResponse toPublic(Project project, String language) {
    return new PublicProjectDetailResponse(
            project.getId(),
            project.getSlug(),
            project.getTitle().resolve(language),
            project.getSubtitle().resolve(language),
            project.getOverview().resolve(language),
            project.getProblem().resolve(language),
            project.getRole().resolve(language),
            project.getArchitecture().resolve(language),
            project.getOutcome().resolve(language),
            project.isFeatured(),
            project.getThemeColor(),
            project.getCoverImageUrl(),
            project.getContextLabel(),
            project.getSections().stream()
                    .map(section -> new PublicProjectSectionResponse(
                            section.getSectionType().name(),
                            section.getTitle().resolve(language),
                            section.getPayload(),
                            section.getSortOrder()))
                    .toList());
}
```

- [ ] **Step 4: `ProjectCommandService.create()` — Project 생성자 업데이트**

```java
Project project = new Project(
        request.slug(),
        toLocalized(request.title()),
        toLocalized(request.subtitle()),
        toLocalized(request.overview()),
        toLocalized(request.problem()),
        toLocalized(request.role()),
        toLocalized(request.architecture()),
        toLocalized(request.outcome()),
        request.featured(),
        request.themeColor(),
        request.coverImageUrl(),
        request.contextLabel());
```

- [ ] **Step 5: `ProjectCommandService.update()` — project.update() 호출 업데이트**

```java
project.update(
        request.slug(),
        toLocalized(request.title()),
        toLocalized(request.subtitle()),
        toLocalized(request.overview()),
        toLocalized(request.problem()),
        toLocalized(request.role()),
        toLocalized(request.architecture()),
        toLocalized(request.outcome()),
        request.featured(),
        request.themeColor(),
        request.coverImageUrl(),
        request.contextLabel(),
        request.sortOrder());
```

- [ ] **Step 6: 빌드 및 테스트 확인**

```bash
cd apps/api && ./gradlew check
```

Expected: BUILD SUCCESSFUL, all tests pass

- [ ] **Step 7: 커밋**

```bash
git add apps/api/src/main/java/com/pak/portfolio/project/
git commit -m "feat(api): contextLabel 필드 DTO/서비스 전파"
```

---

## Task 5: 프론트엔드 타입 업데이트

**Files:**
- Modify: `apps/web/src/lib/api/types.ts`

- [ ] **Step 1: `PublicProjectSummaryResponse`에 `contextLabel` 추가**

```typescript
export interface PublicProjectSummaryResponse {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  overview: string;
  featured: boolean;
  themeColor?: string | null;
  coverImageUrl?: string | null;
  contextLabel?: string | null;
}
```

- [ ] **Step 2: `AdminProjectResponse`에 `contextLabel` 추가**

```typescript
export interface AdminProjectResponse {
  id: number;
  slug: string;
  title: LocalizedTextPayload;
  subtitle: LocalizedTextPayload;
  overview: LocalizedTextPayload;
  problem: LocalizedTextPayload;
  role: LocalizedTextPayload;
  architecture: LocalizedTextPayload;
  outcome: LocalizedTextPayload;
  featured: boolean;
  themeColor?: string | null;
  coverImageUrl?: string | null;
  contextLabel?: string | null;
  status: string;
  sortOrder: number;
  sections: AdminProjectSectionResponse[];
}
```

- [ ] **Step 3: `ProjectRequest`에 `contextLabel` 추가**

```typescript
export interface ProjectRequest {
  slug: string;
  title: LocalizedTextPayload;
  subtitle: LocalizedTextPayload;
  overview: LocalizedTextPayload;
  problem: LocalizedTextPayload;
  role: LocalizedTextPayload;
  architecture: LocalizedTextPayload;
  outcome: LocalizedTextPayload;
  featured: boolean;
  themeColor?: string;
  coverImageUrl?: string;
  contextLabel?: string;
  sortOrder: number;
  sections: AdminProjectSectionResponse[];
}
```

Note: `PublicProjectDetailResponse extends PublicProjectSummaryResponse`이므로 자동으로 포함됨.

- [ ] **Step 4: 타입 체크 확인**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/lib/api/types.ts
git commit -m "feat(web): contextLabel 타입 추가"
```

---

## Task 6: 프론트엔드 — 프로젝트 카드 뱃지

**Files:**
- Modify: `apps/web/src/components/site/project-card.tsx`

- [ ] **Step 1: 헬퍼 함수 + 뱃지 컴포넌트 추가 및 이미지 위 렌더링**

`project-card.tsx`의 커버 이미지 블록(`{project.coverImageUrl && (...)}`):

1. 파일 상단 import 아래에 헬퍼 함수 추가:

```typescript
function getContextBadgeStyle(label: string) {
  const isTeam = label.includes("팀");
  return isTeam
    ? { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.35)", color: "#34d399", icon: "👥" }
    : { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.35)", color: "#60a5fa", icon: "🏢" };
}
```

2. 커버 이미지 블록 내부, `{project.featured && (...)}` 스팬 아래에 추가:

```tsx
{project.contextLabel && (
  <span
    className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
    style={{
      background: getContextBadgeStyle(project.contextLabel).bg,
      border: `1px solid ${getContextBadgeStyle(project.contextLabel).border}`,
      color: getContextBadgeStyle(project.contextLabel).color,
    }}
  >
    {getContextBadgeStyle(project.contextLabel).icon} {project.contextLabel}
  </span>
)}
```

Note: featured 뱃지는 `left-4 top-4`이므로 충돌 방지를 위해 context 뱃지는 `right-3 top-3`에 배치.

- [ ] **Step 2: 타입 체크 확인**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/site/project-card.tsx
git commit -m "feat(web): 프로젝트 카드에 context 뱃지 추가"
```

---

## Task 7: 프론트엔드 — 상세 페이지 뱃지

**Files:**
- Modify: `apps/web/src/components/site/public-screens.tsx`

- [ ] **Step 1: `ProjectDetailScreen`의 eyebrow 행에 context 뱃지 추가**

`public-screens.tsx`에서 `ProjectDetailScreen` 안의 eyebrow 섹션을 찾는다 (약 590라인):

```tsx
{/* Eyebrow */}
<div className="relative mb-6 flex items-center gap-3">
  <span
    className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[4px]"
    style={{
      background: `${accent}18`,
      ...
    }}
  >
    PROJECT
  </span>
```

`PROJECT` 스팬 닫는 태그 바로 다음에 추가:

```tsx
{project.contextLabel && (() => {
  const isTeam = project.contextLabel!.includes("팀");
  const style = isTeam
    ? { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.35)", color: "#34d399", icon: "👥" }
    : { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.35)", color: "#60a5fa", icon: "🏢" };
  return (
    <span
      className="flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold"
      style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
    >
      {style.icon} {project.contextLabel}
    </span>
  );
})()}
```

- [ ] **Step 2: 타입 체크 확인**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/site/public-screens.tsx
git commit -m "feat(web): 프로젝트 상세 페이지에 context 뱃지 추가"
```

---

## Task 8: 어드민 UI 업데이트

**Files:**
- Modify: `apps/web/src/components/admin/project-studio.tsx`

- [ ] **Step 1: `ProjectDraft` 인터페이스에 `contextLabel` 추가**

`sortOrder: number;` 아래에:
```typescript
contextLabel: string;
```

- [ ] **Step 2: `toDraft()` 함수에 `contextLabel` 추가**

`sortOrder: project.sortOrder,` 아래에:
```typescript
contextLabel: project.contextLabel ?? "",
```

- [ ] **Step 3: `buildRequest()` 함수에 `contextLabel` 추가**

`coverImageUrl: draft.coverImageUrl,` 아래에:
```typescript
contextLabel: draft.contextLabel || undefined,
```

- [ ] **Step 4: `createNewProjectRequest()` 함수에 `contextLabel` 추가**

`coverImageUrl: "/images/project-testing-grid.svg",` 아래에:
```typescript
contextLabel: undefined,
```

- [ ] **Step 5: 폼 필드 배열에 `contextLabel` 입력 추가**

`"Cover Image URL"` 항목 다음에:
```typescript
[
  "Context Label",
  draft.contextLabel,
  (value: string) => updateDraftField("contextLabel", value),
],
```

- [ ] **Step 6: 타입 체크 + 빌드 확인**

```bash
cd apps/web && npx tsc --noEmit && npm run build
```

Expected: 에러 없음, 빌드 성공

- [ ] **Step 7: 커밋**

```bash
git add apps/web/src/components/admin/project-studio.tsx
git commit -m "feat(web): 어드민 프로젝트 폼에 Context Label 필드 추가"
```

---

## Task 9: 통합 확인 및 Push

- [ ] **Step 1: 전체 테스트 실행**

```bash
cd /path/to/project && npm run test:web && cd apps/api && ./gradlew check
```

Expected: 모든 테스트 통과

- [ ] **Step 2: 로컬 API 서버 실행 후 동작 확인**

```bash
# 터미널 1
cd apps/api && ./gradlew bootRun

# 터미널 2 (새 터미널)
cd apps/web && npm run dev
```

브라우저에서 `http://localhost:3000/projects` 열어서:
- 각 프로젝트 카드에 커버 이미지 우상단 뱃지 표시 확인
- 각 프로젝트 상세 페이지에서 eyebrow 옆 뱃지 표시 확인
- 회사 프로젝트 파란 뱃지, 팀 프로젝트 초록 뱃지 확인

- [ ] **Step 3: 현재 브랜치를 master에 push**

현재 브랜치: `fix/footer-cleanup-to-master`

```bash
git push origin fix/footer-cleanup-to-master
```

배포 확인은 Vercel 대시보드 또는 크롬 MCP로 `https://portfolio-vibe-web-pyqa.vercel.app/projects` 스크린샷 비교.
