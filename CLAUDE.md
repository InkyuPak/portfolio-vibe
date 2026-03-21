# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root workspace
```bash
npm run dev:web          # Start Next.js dev server
npm run dev:api          # Start Spring Boot API
npm run lint:web         # ESLint on web app
npm run test:web         # Vitest unit tests (web)
npm run test:api         # Gradle test (API)
npm run check:api        # Gradle check including ArchUnit tests
npm run ci               # Full CI: lint + test + build (both apps)
```

### Web app (`apps/web`)
```bash
npm run dev              # next dev
npm run build            # next build
npm run test             # vitest run (single pass)
npm run test:watch       # vitest watch mode
npx vitest run path/to/file.test.tsx   # run a single test file
```

### API (`apps/api`)
```bash
./gradlew bootRun                          # start API
./gradlew test                             # all tests
./gradlew test --tests "FullyQualifiedClass"  # single test class
./gradlew check                            # tests + ArchUnit checks
```

### Infrastructure
```bash
docker compose up -d postgres minio minio-init   # start only deps
docker compose up --build                        # full stack
```

## Environment Setup

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` / `INTERNAL_API_BASE_URL` | Spring API URL for web app |
| `PORTFOLIO_ADMIN_USERNAME` / `PORTFOLIO_ADMIN_PASSWORD` | Admin CMS credentials |
| `PORTFOLIO_R2_*` | S3-compatible storage (MinIO locally) |
| `NEXT_REVALIDATE_SECRET` | Shared secret for Next.js on-demand revalidation webhook |

## Architecture

### Big picture

This is a **bilingual (ko/en) portfolio platform** with a public-facing site, an admin CMS, and a Spring Boot backend. The frontend is Next.js App Router with two route groups: `(public)` and `(admin)`. The backend is a Spring Modulith modular monolith.

### Backend (`apps/api`)

**Package-by-domain modular monolith** under `com.pak.portfolio`. Each domain module follows:
```
{domain}/
  domain/      # JPA entities, value objects
  repository/  # Spring Data repositories
  service/     # *QueryService (reads), *CommandService (writes/mutations)
  controller/  # REST controllers — HTTP concerns only
  dto/         # Request/response records (in a single *Dtos.java file)
  port/        # Interfaces for external integrations (e.g., StoragePort, MailPort)
  adapter/     # Port implementations (e.g., S3StorageAdapter, NoopMailAdapter)
```

Domain modules: `auth`, `project`, `site`, `experience`, `skill`, `media`, `contact`, `common`.

**Key rules (enforced by ArchUnit in `ArchitectureTest`):**
- Controllers must not depend on repositories
- Repositories must not depend on controllers

**API surface:**
- `GET /api/public/**` — public endpoints, no auth
- `POST /api/public/contact` — contact form submission
- `/api/admin/**` — session-based auth required (BCrypt, `JSESSIONID` cookie)
- `/api/admin/auth/login` and `/api/admin/auth/me` — login/session check

**Database:** PostgreSQL with Flyway migrations (`src/main/resources/db/migration`). JPA DDL is set to `validate` — always add a Flyway migration for schema changes.

**Storage:** AWS SDK v2 wired to MinIO locally (or Cloudflare R2 in production) via `StoragePort`/`S3StorageAdapter`.

**On-demand revalidation:** After admin mutations, `WebhookRevalidationAdapter` POSTs to Next.js `/api/revalidate` with a shared secret to bust the cache.

### Frontend (`apps/web`)

**Next.js 16 App Router**, TypeScript, Tailwind CSS v4, React 19.

**Route structure:**
- `app/(public)/` — Korean locale public pages (default)
- `app/(public)/en/` — English locale public pages
- `app/(admin)/admin/` — CMS pages (session-guarded via server-side `getAdminSession`)
- `app/admin/login/` — login page (outside the admin layout guard)

**Localization** is path-based (`/` = Korean, `/en/` = English). The `src/lib/i18n.ts` module handles locale detection, path transformation, and text translation. Content is bilingual; API responses include localized text via a `lang` query parameter.

**API client layers:**
- `src/lib/api/server.ts` — server-side fetch wrappers for all Spring endpoints (forwards session cookies)
- `src/lib/portfolio/portfolio-api.ts` — abstracted `PortfolioApi` interface with `mock` and `live` modes; mode is controlled by `PORTFOLIO_API_MODE` env var or auto-detected from `PORTFOLIO_API_BASE_URL`

**Component organization:**
- `components/site/` — public-facing display components
- `components/admin/` — CMS editor components (client components using `react-hook-form` + `zod`)

**Testing:** Vitest + React Testing Library. Test files co-located with source (`.test.tsx` / `.test.ts`).
