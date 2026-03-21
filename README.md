# Portfolio Vibe

A portfolio platform for a Java/Spring-focused backend engineer with a premium React frontend, structured content CMS, and a modular monolith backend that is designed to be explainable in interviews.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Spring Boot, Java 21, PostgreSQL, Flyway, Spring Security
- Infra: Docker Compose, Caddy, MinIO for local S3-compatible storage

## Workspace Layout

- `apps/web`: public portfolio and admin CMS client
- `apps/api`: portfolio API, auth, content management, media upload
- `infra`: reverse proxy and runtime infrastructure files
- `docs`: architecture and content notes

## Run Locally

1. Copy `.env.example` to `.env` and adjust values.
2. Start dependencies with `docker compose up -d postgres minio minio-init`.
3. Start the API with `cd apps/api && ./gradlew bootRun`.
4. Start the web app with `cd apps/web && npm install && npm run dev`.
5. Open `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for CMS login.

## Full Stack via Docker

Run `docker compose up --build`.

Default admin credentials are controlled by `PORTFOLIO_ADMIN_USERNAME` and `PORTFOLIO_ADMIN_PASSWORD`.

## Architecture Notes

- The backend follows a package-by-domain modular monolith structure.
- Controllers only orchestrate HTTP concerns.
- Services hold transaction boundaries and business use-cases.
- Repositories are data access only.
- Service interfaces are avoided unless a true boundary exists.
- External integrations are modeled as ports and adapters.
- The frontend renders public pages from Spring public APIs and uses `/api` proxy rewrites for CMS editing flows.
