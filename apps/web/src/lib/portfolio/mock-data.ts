import type { MockPortfolioState } from "@/lib/portfolio/contracts";

export function createInitialMockState(): MockPortfolioState {
  return {
    updatedAt: "2025-03-17T10:30:00.000Z",
    profile: {
      id: "profile-main",
      fullName: "Inkyu Pak",
      koreanName: "박인규",
      title: {
        ko: "비즈니스가 믿고 의존할 수 있는 백엔드 시스템을 설계합니다.",
        en: "I design backend systems that the business can trust under load.",
      },
      strapline: {
        ko: "Spring 기반 플랫폼, 운영 가시성, 그리고 팀이 오래 유지할 수 있는 구조에 집중합니다.",
        en: "Focused on Spring platforms, operational visibility, and architectures teams can sustain for years.",
      },
      intro: {
        ko: "결제, 정산, 운영 도구처럼 실패 비용이 높은 제품을 다뤄온 한국의 백엔드 엔지니어입니다. 복잡한 흐름을 단순한 계약과 문서, 그리고 관측 가능한 운영으로 바꾸는 일을 좋아합니다.",
        en: "I am a Korean backend engineer who has worked on high-cost failure domains such as payments, settlements, and internal operations. I like turning complex flows into simple contracts, readable documentation, and observable systems.",
      },
      location: {
        ko: "대한민국 서울",
        en: "Seoul, South Korea",
      },
      availability: {
        ko: "2025년 2분기부터 신규 협업 가능",
        en: "Available for selective collaborations from Q2 2025",
      },
      biography: [
        {
          ko: "지난 몇 년 동안 저는 Spring Boot 기반 서비스들을 운영하면서 이벤트 주도 정산 파이프라인, B2B 연동 제어면, 장애 대응을 위한 관측성 체계를 설계했습니다.",
          en: "Over the last several years I have operated Spring Boot services while designing event-driven settlement pipelines, B2B integration control planes, and observability systems for incident response.",
        },
        {
          ko: "좋아하는 일은 병목을 찾고, 팀이 이해할 수 있는 언어로 구조를 다시 정의한 뒤, 운영 문서와 대시보드까지 함께 마무리하는 것입니다.",
          en: "My favorite work is finding bottlenecks, redefining structure in language the team can understand, and finishing the job with runbooks and dashboards.",
        },
      ],
      specialties: [
        {
          ko: "Spring Boot, JPA, 트랜잭션 경계 설계",
          en: "Spring Boot, JPA, and transactional boundary design",
        },
        {
          ko: "Kafka 기반 비동기 파이프라인과 이벤트 모델링",
          en: "Kafka-driven asynchronous pipelines and event modeling",
        },
        {
          ko: "운영 지표, 로그, 트레이싱을 연결한 관측성 설계",
          en: "Observability design across metrics, logs, and tracing",
        },
        {
          ko: "백오피스 워크플로와 CMS 친화적인 API 계약",
          en: "Back-office workflows and CMS-friendly API contracts",
        },
      ],
      principles: [
        {
          id: "principle-1",
          title: {
            ko: "운영 문서까지가 구현입니다",
            en: "Implementation includes the runbook",
          },
          description: {
            ko: "장애를 줄이는 가장 빠른 방법은 코드와 함께 운영 문맥을 배포하는 것이라고 믿습니다.",
            en: "I believe the fastest way to reduce incidents is to ship operational context with the code.",
          },
        },
        {
          id: "principle-2",
          title: {
            ko: "계약은 단순하게, 내부는 유연하게",
            en: "Simple contracts, flexible internals",
          },
          description: {
            ko: "API 외부 계약은 작게 유지하고 내부 구현은 점진적으로 교체 가능한 구조를 선호합니다.",
            en: "I keep public API contracts small while favoring internals that can be replaced incrementally.",
          },
        },
        {
          id: "principle-3",
          title: {
            ko: "번역 가능한 시스템을 만듭니다",
            en: "I build systems that translate",
          },
          description: {
            ko: "제품 문서, 운영 문서, 관리자 UI 모두 한국어와 영어로 읽히도록 설계합니다.",
            en: "I design product docs, runbooks, and admin tooling so they read well in both Korean and English.",
          },
        },
      ],
      stackBands: [
        {
          id: "stack-1",
          label: {
            ko: "애플리케이션",
            en: "Application",
          },
          items: ["Java 21", "Spring Boot", "Kotlin", "JPA", "Querydsl"],
        },
        {
          id: "stack-2",
          label: {
            ko: "데이터와 메시징",
            en: "Data and Messaging",
          },
          items: ["PostgreSQL", "Redis", "Kafka", "Debezium", "S3"],
        },
        {
          id: "stack-3",
          label: {
            ko: "운영",
            en: "Operations",
          },
          items: ["OpenTelemetry", "Grafana", "Prometheus", "Argo CD", "GitHub Actions"],
        },
      ],
      metrics: [
        {
          label: {
            ko: "백엔드 경력",
            en: "Backend Experience",
          },
          value: "8+ yrs",
          note: {
            ko: "커머스, 핀테크, SaaS",
            en: "Commerce, fintech, and SaaS",
          },
        },
        {
          label: {
            ko: "이전·분리한 서비스",
            en: "Services Migrated",
          },
          value: "14",
          note: {
            ko: "모놀리스에서 점진 분리",
            en: "Incrementally extracted from a monolith",
          },
        },
        {
          label: {
            ko: "정산 마감 단축",
            en: "Settlement Close Improvement",
          },
          value: "2.8x",
          note: {
            ko: "배치 주도에서 이벤트 주도로 전환",
            en: "Moved from batch-led to event-driven flows",
          },
        },
      ],
      contact: {
        email: "hello@inkyu.dev",
        github: "https://github.com/pak-inkyu",
        linkedin: "https://www.linkedin.com/in/inkyu-pak",
        blog: "https://inkyu.dev",
      },
      updatedAt: "2025-03-17T10:30:00.000Z",
      version: "v1.6",
    },
    projects: [
      {
        id: "project-ledger",
        slug: "settlement-ledger",
        status: "live",
        featured: true,
        title: {
          ko: "정산 원장 재구성",
          en: "Settlement Ledger Re-Architecture",
        },
        summary: {
          ko: "야간 일괄 배치에 의존하던 정산 시스템을 이벤트 기반 원장으로 재설계해 마감 속도와 추적 가능성을 함께 높였습니다.",
          en: "Re-architected a settlement system that relied on overnight batch jobs into an event-driven ledger with faster close cycles and clearer traceability.",
        },
        role: {
          ko: "백엔드 리드, 도메인 모델링, 마이그레이션 설계",
          en: "Backend lead, domain modeling, and migration strategy",
        },
        client: {
          ko: "커머스 플랫폼",
          en: "Commerce platform",
        },
        period: "2024",
        stack: ["Spring Boot", "PostgreSQL", "Kafka", "Redis", "OpenTelemetry"],
        highlights: [
          {
            ko: "정산 이벤트를 일관된 스키마로 재정의하고 재처리 전략을 표준화했습니다.",
            en: "Redefined settlement events under a consistent schema and standardized replay handling.",
          },
          {
            ko: "운영팀이 직접 검증 가능한 리컨실리에이션 대시보드를 함께 구축했습니다.",
            en: "Built reconciliation dashboards that operations teams could verify directly.",
          },
        ],
        outcomes: [
          {
            label: {
              ko: "마감 리드타임",
              en: "Close Lead Time",
            },
            value: "-66%",
            note: {
              ko: "3시간에서 1시간 이내",
              en: "From 3 hours to under 1 hour",
            },
          },
          {
            label: {
              ko: "조사 시간",
              en: "Investigation Time",
            },
            value: "-78%",
            note: {
              ko: "트레이싱 기반 원인 추적",
              en: "Tracing-based root cause analysis",
            },
          },
        ],
        updatedAt: "2025-03-15T09:00:00.000Z",
        revision: "r18",
      },
      {
        id: "project-control-plane",
        slug: "partner-control-plane",
        status: "live",
        featured: true,
        title: {
          ko: "B2B 연동 제어면",
          en: "B2B Integration Control Plane",
        },
        summary: {
          ko: "파트너사 API 연결을 설정, 검증, 운영 상태까지 한 화면에서 다룰 수 있도록 관리자 경험과 백엔드 계약을 함께 설계했습니다.",
          en: "Designed both the admin experience and backend contracts for configuring, validating, and operating partner API integrations from one control plane.",
        },
        role: {
          ko: "아키텍처 설계, 인증 흐름, 관리자 API",
          en: "Architecture, auth flows, and admin APIs",
        },
        client: {
          ko: "핀테크 인프라 팀",
          en: "Fintech infrastructure team",
        },
        period: "2023",
        stack: ["Spring Security", "OAuth2", "PostgreSQL", "S3", "Next.js"],
        highlights: [
          {
            ko: "운영자가 JSON을 직접 다루지 않아도 되도록 검증 가능한 폼 기반 워크플로를 설계했습니다.",
            en: "Designed validated form-based workflows so operators never had to edit raw JSON.",
          },
          {
            ko: "파트너별 설정 변경 이력을 남겨 릴리스 리스크를 낮췄습니다.",
            en: "Captured partner-level configuration history to lower release risk.",
          },
        ],
        outcomes: [
          {
            label: {
              ko: "신규 파트너 온보딩",
              en: "New Partner Onboarding",
            },
            value: "-45%",
            note: {
              ko: "설정 시간 단축",
              en: "Reduced configuration time",
            },
          },
          {
            label: {
              ko: "운영 요청",
              en: "Operational Tickets",
            },
            value: "-31%",
            note: {
              ko: "자체 서비스 가능한 관리자 도구",
              en: "Through self-serve admin tooling",
            },
          },
        ],
        updatedAt: "2025-03-12T08:10:00.000Z",
        revision: "r11",
      },
      {
        id: "project-observability",
        slug: "incident-observability",
        status: "pilot",
        featured: true,
        title: {
          ko: "장애 대응 관측성 레이어",
          en: "Incident Observability Layer",
        },
        summary: {
          ko: "서비스별로 흩어져 있던 로그, 메트릭, 트레이스를 하나의 운영 맥락으로 엮어 온콜 대응 시간을 줄였습니다.",
          en: "Connected logs, metrics, and traces scattered across services into a single operational context that reduced on-call response time.",
        },
        role: {
          ko: "관측성 표준화, 알람 설계, 운영 대시보드",
          en: "Observability standards, alerting design, and operational dashboards",
        },
        client: {
          ko: "플랫폼 엔지니어링",
          en: "Platform engineering",
        },
        period: "2022",
        stack: ["OpenTelemetry", "Grafana", "Prometheus", "Tempo", "Loki"],
        highlights: [
          {
            ko: "팀별로 달랐던 로그 필드와 트레이스 컨벤션을 표준화했습니다.",
            en: "Standardized logging fields and trace conventions that previously varied by team.",
          },
          {
            ko: "서비스 오너별 운영 체크리스트와 대시보드 템플릿을 배포했습니다.",
            en: "Shipped dashboard templates and runbooks for each service owner.",
          },
        ],
        outcomes: [
          {
            label: {
              ko: "초기 대응 시간",
              en: "First Response Time",
            },
            value: "-39%",
            note: {
              ko: "공통 알람 문맥 제공",
              en: "Shared alert context for responders",
            },
          },
          {
            label: {
              ko: "재현 가능한 포스트모템",
              en: "Repeatable Postmortems",
            },
            value: "100%",
            note: {
              ko: "트레이스 링크 포함",
              en: "Every incident linked back to traces",
            },
          },
        ],
        updatedAt: "2025-03-10T11:20:00.000Z",
        revision: "r09",
      },
      {
        id: "project-portal",
        slug: "developer-portal",
        status: "confidential",
        featured: false,
        title: {
          ko: "내부 개발자 포털",
          en: "Internal Developer Portal",
        },
        summary: {
          ko: "서비스 소유권, 배포 절차, 운영 문서를 한곳에 모아 신규 팀원이 빠르게 맥락을 이해하도록 지원했습니다.",
          en: "Centralized service ownership, deployment steps, and runbooks so new team members could build context quickly.",
        },
        role: {
          ko: "플랫폼 API, 검색 색인, 문서 구조화",
          en: "Platform APIs, search indexing, and documentation architecture",
        },
        client: {
          ko: "사내 플랫폼 조직",
          en: "Internal platform org",
        },
        period: "2021",
        stack: ["Spring Boot", "OpenSearch", "PostgreSQL", "GitHub Actions"],
        highlights: [
          {
            ko: "서비스 메타데이터와 운영 문서를 한 스키마로 연결했습니다.",
            en: "Connected service metadata and operational docs under one schema.",
          },
          {
            ko: "릴리스 체크리스트가 없는 저장소를 자동으로 표시하도록 했습니다.",
            en: "Flagged repositories that were missing release checklists.",
          },
        ],
        outcomes: [
          {
            label: {
              ko: "온보딩 시간",
              en: "Onboarding Time",
            },
            value: "-30%",
            note: {
              ko: "팀 공통 포털 도입",
              en: "After shipping a unified portal",
            },
          },
        ],
        updatedAt: "2025-03-08T07:40:00.000Z",
        revision: "r05",
      },
    ],
    experiences: [
      {
        id: "experience-hanbit",
        company: "Hanbit Commerce",
        team: {
          ko: "플랫폼 백엔드 팀",
          en: "Platform Backend Team",
        },
        role: {
          ko: "시니어 백엔드 엔지니어",
          en: "Senior Backend Engineer",
        },
        period: "2021 - Present",
        location: {
          ko: "서울 / 하이브리드",
          en: "Seoul / Hybrid",
        },
        summary: {
          ko: "정산, 주문 후처리, 관리자 도구를 담당하며 서비스 분리와 운영 가시성 개선을 주도했습니다.",
          en: "Owned settlement, post-order workflows, and internal tooling while leading service extraction and observability improvements.",
        },
        achievements: [
          {
            ko: "정산 원장 재구성과 리컨실리에이션 대시보드를 설계했습니다.",
            en: "Designed the settlement ledger re-architecture and reconciliation dashboards.",
          },
          {
            ko: "운영팀이 직접 사용할 수 있는 관리자 워크플로를 백엔드 계약과 함께 정의했습니다.",
            en: "Defined admin workflows together with backend contracts that operations teams could use directly.",
          },
        ],
        stack: ["Spring Boot", "Kafka", "PostgreSQL", "Redis", "Grafana"],
        current: true,
        updatedAt: "2025-03-15T12:30:00.000Z",
      },
      {
        id: "experience-orbit",
        company: "Orbit Payments",
        team: {
          ko: "결제 인프라",
          en: "Payments Infrastructure",
        },
        role: {
          ko: "백엔드 엔지니어",
          en: "Backend Engineer",
        },
        period: "2018 - 2021",
        location: {
          ko: "판교",
          en: "Pangyo",
        },
        summary: {
          ko: "거래 상태 머신, 파트너 연동 API, 장애 대응 체계를 개선했습니다.",
          en: "Improved transaction state machines, partner-facing APIs, and incident response practices.",
        },
        achievements: [
          {
            ko: "파트너 인증 설정을 표준화해 운영 오류를 줄였습니다.",
            en: "Standardized partner authentication setup and reduced operational errors.",
          },
          {
            ko: "주요 결제 흐름에 대한 분산 추적을 도입했습니다.",
            en: "Introduced distributed tracing across critical payment flows.",
          },
        ],
        stack: ["Java", "Spring MVC", "MySQL", "Redis", "Prometheus"],
        current: false,
        updatedAt: "2025-03-11T09:10:00.000Z",
      },
      {
        id: "experience-layerworks",
        company: "Layerworks",
        team: {
          ko: "프로덕트 엔지니어링",
          en: "Product Engineering",
        },
        role: {
          ko: "소프트웨어 엔지니어",
          en: "Software Engineer",
        },
        period: "2016 - 2018",
        location: {
          ko: "서울",
          en: "Seoul",
        },
        summary: {
          ko: "초기 SaaS 제품의 API와 백오피스 기능을 함께 개발하며 제품 개발 전반의 속도를 올렸습니다.",
          en: "Built APIs and back-office features for an early-stage SaaS product and increased product delivery speed across the team.",
        },
        achievements: [
          {
            ko: "관리자 백오피스에 승인 워크플로를 추가했습니다.",
            en: "Added approval workflows to the internal back office.",
          },
          {
            ko: "API 문서와 배포 체크리스트를 정착시켰습니다.",
            en: "Established API docs and release checklists as standard practice.",
          },
        ],
        stack: ["Spring Boot", "PostgreSQL", "Thymeleaf", "AWS"],
        current: false,
        updatedAt: "2025-03-09T13:20:00.000Z",
      },
    ],
    writings: [
      {
        id: "writing-1",
        title: {
          ko: "조직이 바뀌어도 살아남는 API를 설계하는 법",
          en: "Designing APIs That Survive Org Change",
        },
        excerpt: {
          ko: "팀 구조가 달라져도 계약이 버틸 수 있도록 만드는 작은 기준들을 정리했습니다.",
          en: "A short field guide for building API contracts that stay stable even when teams reorganize.",
        },
        category: {
          ko: "API 디자인",
          en: "API Design",
        },
        publishedAt: "2025-02-12",
        readingTime: "6 min",
      },
      {
        id: "writing-2",
        title: {
          ko: "큐 소비자에게도 운영 예산이 필요합니다",
          en: "Queue Consumers Need Operational Budgets Too",
        },
        excerpt: {
          ko: "백프레셔, 재시도, DLQ를 비용 관점에서 설명하는 글입니다.",
          en: "On describing backpressure, retries, and dead letters as operational budget decisions.",
        },
        category: {
          ko: "운영",
          en: "Operations",
        },
        publishedAt: "2025-01-09",
        readingTime: "4 min",
      },
      {
        id: "writing-3",
        title: {
          ko: "이중 언어 문서는 생각보다 빠른 도구입니다",
          en: "Bilingual Docs Are Faster Than You Think",
        },
        excerpt: {
          ko: "한국어와 영어를 함께 유지하면 온보딩과 협업 속도가 어떻게 달라지는지 사례를 담았습니다.",
          en: "Examples of how keeping Korean and English docs together changes onboarding and collaboration speed.",
        },
        category: {
          ko: "팀 운영",
          en: "Team Practices",
        },
        publishedAt: "2024-12-01",
        readingTime: "5 min",
      },
    ],
    activity: [
      {
        id: "activity-1",
        actor: "Inkyu Pak",
        target: "Settlement Ledger Re-Architecture",
        status: "published",
        action: {
          ko: "대표 프로젝트 요약을 갱신했습니다.",
          en: "Updated the featured project summary.",
        },
        occurredAt: "2025-03-15T09:00:00.000Z",
      },
      {
        id: "activity-2",
        actor: "Inkyu Pak",
        target: "Profile",
        status: "updated",
        action: {
          ko: "협업 가능 시점과 소개 문구를 수정했습니다.",
          en: "Edited availability and the opening introduction.",
        },
        occurredAt: "2025-03-14T16:40:00.000Z",
      },
      {
        id: "activity-3",
        actor: "Inkyu Pak",
        target: "Bilingual Docs Are Faster Than You Think",
        status: "draft",
        action: {
          ko: "노트 초안을 관리자 영역에 저장했습니다.",
          en: "Saved a note draft in the admin area.",
        },
        occurredAt: "2025-03-13T08:20:00.000Z",
      },
    ],
  };
}
