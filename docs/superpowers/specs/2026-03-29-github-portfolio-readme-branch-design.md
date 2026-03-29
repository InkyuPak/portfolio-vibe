# GitHub 포트폴리오 README & 브랜치 전략 설계

**날짜:** 2026-03-29
**목표:** 포트폴리오 GitHub 공개 전, README 한글화 + 브랜치 전략 실제 적용

---

## 1. README.md 재작성

### 방향
- 한글 1인칭 시점 — "내가 왜 이 선택을 했는가"
- 설계 원칙 4개를 각각 why/how로 설명
- 기술 나열이 아닌 설계 철학 중심

### 구성
1. **프로젝트 소개** — 한 줄 설명, 라이브 링크, CI 배지
2. **기술 스택** — 간결하게
3. **백엔드 설계 원칙** (핵심 섹션)
   - 패키지-바이-도메인: 왜 레이어 패키지 대신 도메인 패키지를 택했는가
   - 포트 & 어댑터: 왜 외부 의존성을 추상화했는가 (StoragePort, MailPort)
   - QueryService / CommandService 분리: 왜 읽기와 쓰기를 나눴는가
   - ArchUnit + 계층별 테스트: 왜 설계 규칙을 코드로 강제했는가
4. **브랜치 전략** — master/develop/feature 흐름 설명
5. **로컬 실행 방법**

---

## 2. 브랜치 전략

### 구조
```
feature/xxx → develop → master
```

- `feature/*`: 기능 단위 작업 브랜치
- `develop`: 통합 브랜치 — PR + CI 통과 필수
- `master`: 프로덕션 브랜치 — develop에서 PR + CI 통과 후 머지 → 자동 배포

### 배포 흐름
- Vercel: master 브랜치 연결 → 머지 시 자동 배포
- Railway: master 브랜치 연결 → 머지 시 자동 배포

---

## 3. CI Workflow 수정

### 현재 트리거
```yaml
on:
  push:
    branches: [main, master, "codex/**"]
  pull_request:
```

### 변경 후 트리거
```yaml
on:
  push:
    branches: [master, develop, "feature/**"]
  pull_request:
    branches: [master, develop]
```

- `pull_request`의 base 브랜치를 명시적으로 master/develop으로 제한
- feature 브랜치 push 시에도 CI 실행 (빠른 피드백)

---

## 4. GitHub 브랜치 보호 규칙 (수동 설정 필요)

사용자가 GitHub UI에서 직접 설정:

**master 브랜치:**
- Require a pull request before merging
- Require status checks to pass: `api`, `web`
- Include administrators

**develop 브랜치:**
- Require a pull request before merging
- Require status checks to pass: `api`, `web`

---

## 완료 기준
- [ ] develop 브랜치 생성
- [ ] CI workflow 트리거 수정
- [ ] README.md 한글 재작성
- [ ] GitHub 브랜치 보호 규칙 가이드 제공
