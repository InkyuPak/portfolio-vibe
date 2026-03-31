# Project Context Badge Design

**Date:** 2026-03-31
**Status:** Approved

## Overview

프로젝트 카드와 상세 페이지에 "어디서 한 프로젝트인지" 뱃지를 표시한다.
GitHub 링크 없이도 면접관이 왜 코드 공유가 없는지 직관적으로 이해할 수 있게 하는 것이 목적.
회사 프로젝트는 사내 코드라 공유 불가, 팀 프로젝트는 팀원 동의 없어 비공개.

## Data

`project` 테이블에 nullable `context_label VARCHAR(100)` 컬럼 추가.
프리텍스트(free text)로 관리. 어드민에서 직접 편집 가능.

### 초기 데이터

| slug | context_label |
|---|---|
| hospital-integration-test-framework | 시너지에이아이 |
| hospital-integration-automation | 시너지에이아이 |
| crowd-analysis-vision-system | 클로버스튜디오 |
| msa-observability-upgrade | 클로버스튜디오 |
| rfp-hunter | 팀 프로젝트 · 2인 |
| adsync-engine | 팀 프로젝트 · 2인 |

## Badge Design

- **색상 규칙:** `🏢`(회사) → 파란 계열 (`#60a5fa`), `👥`(팀) → 초록 계열 (`#34d399`)
  - `context_label`에 "팀" 포함 여부로 프론트에서 색상 분기
- **스타일:** 둥근 알약 뱃지, 반투명 배경 + 컬러 테두리

## Display Locations

### 1. 프로젝트 목록 카드 (`project-card.tsx`)
커버 이미지 위 좌상단 오버레이. 이미지 없는 카드는 표시 안 함.

### 2. 프로젝트 상세 페이지 (`public-screens.tsx` — `ProjectDetailScreen`)
"PROJECT" eyebrow 알약 옆에 나란히.

## Architecture

### Backend

1. **Flyway V7** — `ALTER TABLE project ADD COLUMN context_label VARCHAR(100);` + 기존 6개 프로젝트 UPDATE
2. **`Project.java`** — `contextLabel` 필드 추가 (getter, constructor, update 메서드)
3. **`ProjectDtos.java`** — 4개 record에 `contextLabel` 추가:
   - `ProjectRequest` (admin input)
   - `AdminProjectResponse` (admin read)
   - `PublicProjectSummaryResponse` (public list)
   - `PublicProjectDetailResponse` (public detail)
4. **`ProjectQueryService.java`** — 매핑에 `contextLabel` 포함
5. **`ProjectCommandService.java`** — 생성/수정 시 `contextLabel` 처리

### Frontend (Web)

6. **API types** — `PublicProjectSummaryResponse`, `PublicProjectDetailResponse`에 `contextLabel?: string` 추가
7. **`project-card.tsx`** — 커버 이미지 위 뱃지 렌더링 (`contextLabel` 있을 때만)
8. **`public-screens.tsx`** — ProjectDetailScreen eyebrow 옆 뱃지

### Admin UI

9. **어드민 프로젝트 편집 폼** — "Context Label" 텍스트 입력 필드 추가

## Out of Scope

- 회사별 필터링 기능 (향후 필요 시 enum 분리)
- 커버 이미지 없는 카드에서의 뱃지 표시
- 영문(en) 뱃지 별도 텍스트 (동일 텍스트 사용)
