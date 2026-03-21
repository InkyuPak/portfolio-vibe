# Portfolio Redesign — Design Spec
Date: 2026-03-17

## Goal
Complete visual overhaul of the public portfolio to a dark-premium style (modern dark + purple accent) and extend the backend with Education and Award entities so the portfolio fully replaces a traditional resume.

---

## Approved Design Direction
- **Style**: Modern Dark Premium (Vercel/Linear aesthetic)
- **Accent color**: Purple/Violet (`#7c3aed` → `#4f46e5` gradient)
- **Background**: `#05050f` near-black
- **Grid overlay**: subtle purple-tinted grid at 4% opacity
- **Glow blobs**: animated radial gradients in purple/indigo
- **Typography**: existing Noto Sans KR + Noto Serif KR, larger hero sizes
- **Cards**: glassmorphism with `rgba(139,92,246,0.06)` bg, `rgba(139,92,246,0.15)` border
- **Buttons**: Primary = purple gradient + glow shadow. Secondary = ghost with subtle border

---

## Backend Changes

### 1. Flyway V2 migration — new tables: `education`, `award`

```sql
-- education: university, degree, period
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

-- award: certifications, competitions, publications
create table award (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    award_type varchar(50) not null,  -- CERTIFICATION, COMPETITION, PUBLICATION, EDUCATION_COURSE
    title_ko text not null,
    title_en text,
    issuer_ko text not null,
    issuer_en text,
    period_label varchar(50) not null,  -- plain String (non-localized), e.g. "2024.04" — NOT a LocalizedText embed
    description_ko text,
    description_en text
-- NOTE: period_label is intentionally a single plain column (not period_label_ko/en).
-- Award dates are short non-localized strings. The Award entity must use a plain String field, not LocalizedText.
);
```

### 2. New domain classes — inside `site` module
- `Education` entity extending `PublishableEntity`
- `Award` entity extending `PublishableEntity`
- `EducationRepository` (Spring Data JPA)
- `AwardRepository` (Spring Data JPA)
- DTOs in `SiteDtos.java`: `PublicEducationResponse`, `PublicAwardResponse`, `AdminEducationResponse`, `AdminAwardResponse`

### 3. Service layer updates — `SiteQueryService`
- `listPublishedEducation(Locale)` → `List<PublicEducationResponse>`
- `listPublishedAwards(Locale)` → `List<PublicAwardResponse>`
- `listAdminEducation()` / `listAdminAwards()` for CMS

### 4. Controller updates — `SiteController`
New public endpoints:
- `GET /api/public/education?lang={ko|en}` → `List<PublicEducationResponse>`
- `GET /api/public/awards?lang={ko|en}` → `List<PublicAwardResponse>`

New admin endpoints:
- `GET /api/admin/education` → `List<AdminEducationResponse>`
- `GET /api/admin/awards` → `List<AdminAwardResponse>`

### 5. DataBootstrap seed data

**Education:**
- 서울과학기술대학교 / 기계시스템디자인공학과 / 2013.03 ~ 2020.08 / 수료

**Awards (from PDF):**
- PUBLICATION: 한국항공우주학회 2024 춘계학술대회 논문 투고 (2024.04)
- EDUCATION_COURSE: [NCIA교육센터] ChatGPT 기술 구현 (2024.06)
- EDUCATION_COURSE: [NCIA교육센터] 딥러닝 기반 객체탐지 및 고성능 비전 프레임워크 활용 (2024.04)
- EDUCATION_COURSE: [KEA] 파이썬을 활용한 알고리즘&머신러닝 활용 (2024.03)
- COMPETITION: 2019 CES 공모전 참가(수상) / 교내 최우수상 (2018.12)

### 6. Backend test coverage
- Unit test: `SiteQueryServiceTest` — education/award query methods with mocked repos
- Slice test: extend `PublicApiWebMvcTest` with education/award endpoint assertions
- ArchUnit: no new modules needed; education/award live in `site` module

---

## Frontend Changes

### CSS variables overhaul — `globals.css`
Replace the warm cream theme entirely:
```css
--background: #05050f;
--foreground: #f9fafb;
--muted: rgba(249,250,251,0.5);
--line: rgba(139,92,246,0.15);
--accent: #8b5cf6;
--accent-gradient: linear-gradient(135deg, #7c3aed, #4f46e5);
--card-bg: rgba(139,92,246,0.06);
--card-border: rgba(139,92,246,0.15);
--card-hover-bg: rgba(139,92,246,0.10);
--card-hover-border: rgba(139,92,246,0.30);
```
Add global grid overlay (40px grid, 4% opacity purple lines) and animated blob keyframes.

### Components to redesign (all in `apps/web/src/`)

| File | Change |
|------|--------|
| `app/globals.css` | Full dark theme variables, grid overlay, blob animations, glass-panel utility |
| `components/site/public-chrome.tsx` | Dark glassmorphism nav + footer; "재직중" live badge in top-right |
| `components/site/public-screens.tsx` | All screens rebuilt with dark premium layout (see screen-by-screen below) |
| `components/site/project-card.tsx` | Dark card with purple gradient top border, theme-color glow shadow |
| `components/site/experience-timeline.tsx` | Dark timeline; current-company badge with green pulse dot |
| `components/site/skill-grid.tsx` | Dark skill cards with purple accent group labels |
| `components/site/section-heading.tsx` | Eyebrow with purple color; title with gradient option |
| `components/site/contact-form.tsx` | Dark input fields with purple focus ring |
| `lib/api/types.ts` | Add `PublicEducationResponse`, `PublicAwardResponse` interfaces |
| `lib/api/server.ts` | Add `getEducation()`, `getAwards()` functions |

### HomeScreen sections (in order)
1. **Hero** — status badge (green pulse "재직중"), eyebrow, gradient name, subtitle, 2 CTAs (no download button), achievement stat grid (2년5개월 / 5개병원 / 530건 무장애 / 8+프로젝트), big achievement banner (병원 연동 성과)
2. **Featured Projects** — 2 columns dark cards
3. **Experience** — dark timeline, 시너지AI prominent with highlights, 클로버 secondary, 강사 as note
4. **Skills** — dark skill grid grouped by backend/infra/AI
5. **Education & Awards** — new section showing education + award/cert items
6. **Contact** — dark contact form + details

### ProjectDetailScreen
- Dark hero with purple gradient title
- Dark 2x2 problem/role/architecture/outcome grid
- Dark section blocks (metrics, timeline, gallery, diagram, markdown)

---

## API layer additions in `lib/api/server.ts`
```ts
export function getEducation(locale: "ko" | "en") { ... }
export function getAwards(locale: "ko" | "en") { ... }
```

---

## Out of scope
- Admin CMS UI for Education/Award (read-only via DataBootstrap seed)
- i18n routing changes
- Mock-mode implementation for new endpoints (fallback to empty array)

---

## Success criteria
1. `./gradlew check` passes (all ArchUnit + unit + slice tests green)
2. `npm run test` passes (vitest)
3. `npm run build` succeeds
4. Public site shows dark premium design with all real content from PDF
5. Education and Awards section visible on public home page
6. No warm-cream colors remain in public-facing pages
