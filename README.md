# 박인규 포트폴리오

Java 백엔드 개발자 박인규의 포트폴리오 플랫폼입니다.
공개 포트폴리오 사이트와 어드민 CMS, Spring Boot 백엔드로 구성된 풀스택 프로젝트입니다.

[![CI](https://github.com/InkyuPak/portfolio-vibe/actions/workflows/ci.yml/badge.svg)](https://github.com/InkyuPak/portfolio-vibe/actions/workflows/ci.yml)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **백엔드** | Java 21, Spring Boot 3, Spring Security, Spring Modulith |
| **데이터** | PostgreSQL, Flyway, Spring Data JPA |
| **프론트엔드** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **인프라** | Docker Compose, Caddy, MinIO (로컬), Cloudflare R2 (운영) |
| **배포** | Railway (API), Vercel (Web) |

---

## 백엔드 설계 원칙

### 1. 패키지-바이-도메인

```
com.pak.portfolio/
  auth/         # 인증
  project/      # 프로젝트
  experience/   # 경력
  skill/        # 기술 스택
  media/        # 미디어 업로드
  contact/      # 문의
  site/         # 사이트 설정
  common/       # 공통
```

계층(controller, service, repository)을 기준으로 패키지를 나누면 관련 코드가 여러 패키지에 흩어집니다.
도메인 기준으로 나누면 한 기능의 변경이 한 패키지 안에서 끝납니다.
응집도를 높이고 불필요한 의존성 탐색을 줄이기 위해 이 방식을 선택했습니다.

---

### 2. 포트 & 어댑터 (외부 의존성 추상화)

```java
// 비즈니스 로직은 인터페이스에만 의존
public interface StoragePort {
    String upload(String key, byte[] data, String contentType);
}

// 실제 구현은 어댑터에서
@Component
public class S3StorageAdapter implements StoragePort { ... }
```

외부 서비스(S3, 메일 발송 등)는 언제든 바뀔 수 있습니다.
비즈니스 로직이 특정 구현체에 직접 의존하면 교체 비용이 커집니다.
인터페이스(Port)를 두고 구현체(Adapter)를 주입하면, 테스트 시 Mock으로 교체하거나 실제 구현체를 바꿔도 비즈니스 로직은 그대로입니다.

현재 적용된 Port: `StoragePort`, `MailPort`, `RevalidationPort`

---

### 3. QueryService / CommandService 분리

```
project/
  service/
    ProjectQueryService.java   # 조회만
    ProjectCommandService.java # 생성/수정/삭제
```

읽기와 쓰기는 책임이 다릅니다.
하나의 Service 클래스가 조회와 변경을 모두 담당하면 트랜잭션 처리, 캐시 전략, 테스트 작성이 복잡해집니다.
분리하면 각 Service가 단일 책임을 가지고, CommandService에서만 `@Transactional`을 신경쓰면 됩니다.

---

### 4. ArchUnit으로 설계 규칙 강제

```java
@ArchTest
static final ArchRule controllerShouldNotDependOnRepository =
    noClasses().that().resideInAPackage("..controller..")
        .should().dependOnClassesThat().resideInAPackage("..repository..");
```

"Controller는 Repository를 직접 호출하면 안 된다"는 규칙을 문서나 코드 리뷰에만 맡기면 언젠간 깨집니다.
ArchUnit으로 이 규칙을 테스트 코드로 만들어 CI에서 자동 검증합니다.
규칙을 어기면 빌드가 실패하기 때문에 설계 원칙이 실제로 지켜집니다.

테스트 전략:
- `ArchitectureTest` — 레이어 간 의존성 규칙 검증
- `*CommandServiceTest` — 서비스 단위 테스트 (Mock 기반)
- `*WebMvcTest` — 컨트롤러 슬라이스 테스트

---

## 브랜치 전략

```
feature/xxx → develop → master
                            ↓
                         자동 배포 (Railway, Vercel)
```

| 브랜치 | 역할 |
|--------|------|
| `master` | 프로덕션 브랜치. PR + CI 통과 후 머지. 머지 즉시 배포 |
| `develop` | 통합 브랜치. feature PR을 여기로 머지 |
| `feature/*` | 기능 단위 작업 브랜치 |

모든 PR은 CI(백엔드 Gradle 빌드/테스트/ArchUnit + 프론트엔드 lint/test/build)를 통과해야 머지할 수 있습니다.

---

## 로컬 실행

### 사전 준비

```bash
cp .env.example .env
```

### 의존성 실행 (PostgreSQL + MinIO)

```bash
docker compose up -d postgres minio minio-init
```

### API 실행

```bash
cd apps/api
./gradlew bootRun
```

### Web 실행

```bash
cd apps/web
npm install
npm run dev
```

- 공개 사이트: `http://localhost:3000`
- 어드민: `http://localhost:3000/admin/login`

### 전체 Docker 실행

```bash
docker compose up --build
```

---

## 데이터베이스 마이그레이션 규칙

스키마 변경은 항상 Flyway 마이그레이션 파일로만 합니다.
JPA DDL은 `validate` 모드로 설정되어 있어, 마이그레이션 파일 없이 엔티티를 변경하면 애플리케이션이 시작되지 않습니다.

```
apps/api/src/main/resources/db/migration/
  V1__init.sql
  V2__add_experience.sql
  ...
```
