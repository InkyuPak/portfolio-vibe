import type { LocalizedText } from "@/lib/i18n";
import { createInitialMockState } from "@/lib/portfolio/mock-data";
import type {
  AdminDashboardRecord,
  AdminExperienceRecord,
  AdminProfileRecord,
  AdminProjectRecord,
  DashboardActivityRecord,
  ExperienceMutationInput,
  PortfolioSite,
  ProfileMutationInput,
  ProjectMutationInput,
  WritingRecord,
} from "@/lib/portfolio/contracts";
import { toSlug } from "@/lib/utils";

let state = createInitialMockState();

function cloneState<T>(value: T): T {
  return structuredClone(value);
}

function nowIso() {
  return new Date().toISOString();
}

function nextRevision(previous?: string) {
  const numeric = Number(previous?.replace(/\D/g, "") ?? "0") + 1;
  return `r${String(numeric).padStart(2, "0")}`;
}

function completion(entries: LocalizedText[]) {
  const total = entries.length || 1;

  return {
    ko: Math.round(
      (entries.filter((entry) => entry.ko.trim().length > 0).length / total) *
        100,
    ),
    en: Math.round(
      (entries.filter((entry) => entry.en.trim().length > 0).length / total) *
        100,
    ),
  };
}

function collectProfileTranslations(profile: AdminProfileRecord) {
  return [
    profile.title,
    profile.strapline,
    profile.intro,
    profile.location,
    profile.availability,
    ...profile.biography,
    ...profile.specialties,
    ...profile.principles.flatMap((item) => [item.title, item.description]),
    ...profile.metrics.flatMap((item) =>
      item.note ? [item.label, item.note] : [item.label],
    ),
  ];
}

function collectProjectTranslations(projects: AdminProjectRecord[]) {
  return projects.flatMap((project) => [
    project.title,
    project.summary,
    project.role,
    project.client,
    ...project.highlights,
    ...project.outcomes.flatMap((item) =>
      item.note ? [item.label, item.note] : [item.label],
    ),
  ]);
}

function collectExperienceTranslations(experiences: AdminExperienceRecord[]) {
  return experiences.flatMap((experience) => [
    experience.team,
    experience.role,
    experience.location,
    experience.summary,
    ...experience.achievements,
  ]);
}

function collectWritingTranslations(writings: WritingRecord[]) {
  return writings.flatMap((writing) => [
    writing.title,
    writing.excerpt,
    writing.category,
  ]);
}

function appendActivity(activity: DashboardActivityRecord) {
  state.activity = [activity, ...state.activity].slice(0, 8);
}

function refreshUpdatedAt() {
  state.updatedAt = nowIso();
}

export function resetMockState(nextState = createInitialMockState()) {
  state = cloneState(nextState);
}

export function getPortfolioSiteSnapshot(): PortfolioSite {
  return cloneState({
    updatedAt: state.updatedAt,
    profile: state.profile,
    projects: state.projects,
    experiences: state.experiences,
    writings: state.writings,
  });
}

export function getAdminDashboardSnapshot(): AdminDashboardRecord {
  const profileTranslations = completion(collectProfileTranslations(state.profile));
  const projectTranslations = completion(collectProjectTranslations(state.projects));
  const experienceTranslations = completion(
    collectExperienceTranslations(state.experiences),
  );
  const writingTranslations = completion(collectWritingTranslations(state.writings));

  return cloneState({
    metrics: [
      {
        id: "metric-projects",
        label: {
          ko: "대표 프로젝트",
          en: "Featured Projects",
        },
        value: String(state.projects.filter((project) => project.featured).length),
        note: {
          ko: "홈페이지에 노출 중",
          en: "Visible on the homepage",
        },
      },
      {
        id: "metric-experience",
        label: {
          ko: "경력 항목",
          en: "Experience Entries",
        },
        value: String(state.experiences.length),
        note: {
          ko: "현재 직무 포함",
          en: "Including current role",
        },
      },
      {
        id: "metric-locales",
        label: {
          ko: "번역 커버리지",
          en: "Translation Coverage",
        },
        value: `${Math.round(
          (profileTranslations.en +
            projectTranslations.en +
            experienceTranslations.en +
            writingTranslations.en) /
            4,
        )}%`,
        note: {
          ko: "영문 필드 완성도 기준",
          en: "Measured by English field completeness",
        },
      },
    ],
    activity: state.activity,
    translations: [
      {
        id: "translation-profile",
        section: {
          ko: "프로필",
          en: "Profile",
        },
        localeCompletion: profileTranslations,
        note: {
          ko: "히어로 문구와 소개, 원칙 포함",
          en: "Includes hero copy, intro, and principles",
        },
      },
      {
        id: "translation-projects",
        section: {
          ko: "프로젝트",
          en: "Projects",
        },
        localeCompletion: projectTranslations,
        note: {
          ko: "요약, 역할, 하이라이트 기준",
          en: "Based on summaries, roles, and highlights",
        },
      },
      {
        id: "translation-experience",
        section: {
          ko: "경력",
          en: "Experience",
        },
        localeCompletion: experienceTranslations,
        note: {
          ko: "회사 소개와 성과 항목 포함",
          en: "Includes summaries and achievements",
        },
      },
      {
        id: "translation-writing",
        section: {
          ko: "노트",
          en: "Writing",
        },
        localeCompletion: writingTranslations,
        note: {
          ko: "제목, 카테고리, 발췌문 기준",
          en: "Based on title, category, and excerpt",
        },
      },
    ],
    releaseChecklist: [
      {
        id: "check-featured-projects",
        label: {
          ko: "대표 프로젝트 3건 이상 유지",
          en: "Keep at least 3 featured projects",
        },
        done: state.projects.filter((project) => project.featured).length >= 3,
      },
      {
        id: "check-current-role",
        label: {
          ko: "현재 역할 정보 최신 상태",
          en: "Current role is up to date",
        },
        done: state.experiences.some((experience) => experience.current),
      },
      {
        id: "check-quarterly-note",
        label: {
          ko: "최근 분기 내 작성 노트 보유",
          en: "At least one note published this quarter",
        },
        done: state.writings.some((writing) => writing.publishedAt >= "2025-01-01"),
      },
    ],
  });
}

export function getAdminProfileSnapshot(): AdminProfileRecord {
  return cloneState(state.profile);
}

export function listAdminProjectsSnapshot(): AdminProjectRecord[] {
  return cloneState(state.projects);
}

export function listAdminExperienceSnapshot(): AdminExperienceRecord[] {
  return cloneState(state.experiences);
}

export function createAdminProjectSnapshot(): AdminProjectRecord {
  const timestamp = nowIso();
  const index = state.projects.length + 1;
  const draft: AdminProjectRecord = {
    id: `project-draft-${index}`,
    slug: `new-project-${index}`,
    status: "pilot",
    featured: false,
    title: {
      ko: `새 프로젝트 ${index}`,
      en: `New Project ${index}`,
    },
    summary: {
      ko: "프로젝트 요약을 입력하세요.",
      en: "Add the project summary.",
    },
    role: {
      ko: "담당 역할을 입력하세요.",
      en: "Describe your role.",
    },
    client: {
      ko: "조직 또는 클라이언트",
      en: "Organization or client",
    },
    period: "2025",
    stack: ["Spring Boot", "PostgreSQL"],
    highlights: [
      {
        ko: "핵심 하이라이트를 입력하세요.",
        en: "Add the first highlight.",
      },
    ],
    outcomes: [
      {
        label: {
          ko: "핵심 성과",
          en: "Primary Outcome",
        },
        value: "TBD",
        note: {
          ko: "추후 업데이트 예정",
          en: "To be updated",
        },
      },
    ],
    updatedAt: timestamp,
    revision: "r01",
  };

  state.projects = [draft, ...state.projects];
  refreshUpdatedAt();
  appendActivity({
    id: `activity-project-${index}`,
    actor: state.profile.fullName,
    target: draft.title.en,
    status: "draft",
    action: {
      ko: "새 프로젝트 초안을 생성했습니다.",
      en: "Created a new project draft.",
    },
    occurredAt: timestamp,
  });

  return cloneState(draft);
}

export function updateAdminProjectSnapshot(
  projectId: string,
  input: ProjectMutationInput,
): AdminProjectRecord {
  const targetIndex = state.projects.findIndex((project) => project.id === projectId);

  if (targetIndex === -1) {
    throw new Error(`Project ${projectId} not found`);
  }

  const previous = state.projects[targetIndex];
  const timestamp = nowIso();
  const slug = toSlug(input.slug) || previous.slug;
  const nextProject: AdminProjectRecord = {
    ...previous,
    ...input,
    slug,
    updatedAt: timestamp,
    revision: nextRevision(previous.revision),
  };

  state.projects = state.projects.map((project) =>
    project.id === projectId ? nextProject : project,
  );
  refreshUpdatedAt();
  appendActivity({
    id: `activity-${projectId}-${timestamp}`,
    actor: state.profile.fullName,
    target: nextProject.title.en,
    status: "updated",
    action: {
      ko: "프로젝트 내용을 저장했습니다.",
      en: "Saved project changes.",
    },
    occurredAt: timestamp,
  });

  return cloneState(nextProject);
}

export function updateAdminExperienceSnapshot(
  experienceId: string,
  input: ExperienceMutationInput,
): AdminExperienceRecord {
  const targetIndex = state.experiences.findIndex(
    (experience) => experience.id === experienceId,
  );

  if (targetIndex === -1) {
    throw new Error(`Experience ${experienceId} not found`);
  }

  const timestamp = nowIso();
  const nextExperience: AdminExperienceRecord = {
    ...state.experiences[targetIndex],
    ...input,
    updatedAt: timestamp,
  };

  state.experiences = state.experiences.map((experience) =>
    experience.id === experienceId ? nextExperience : experience,
  );
  refreshUpdatedAt();
  appendActivity({
    id: `activity-${experienceId}-${timestamp}`,
    actor: state.profile.fullName,
    target: nextExperience.company,
    status: "updated",
    action: {
      ko: "경력 항목을 갱신했습니다.",
      en: "Updated an experience entry.",
    },
    occurredAt: timestamp,
  });

  return cloneState(nextExperience);
}

export function updateAdminProfileSnapshot(
  input: ProfileMutationInput,
): AdminProfileRecord {
  const timestamp = nowIso();
  const currentVersion = Number(
    state.profile.version.replace(/[^\d.]/g, "") || "1.0",
  );
  const nextProfile: AdminProfileRecord = {
    ...state.profile,
    ...input,
    updatedAt: timestamp,
    version: `v${(currentVersion + 0.1).toFixed(1)}`,
  };

  state.profile = nextProfile;
  refreshUpdatedAt();
  appendActivity({
    id: `activity-profile-${timestamp}`,
    actor: state.profile.fullName,
    target: "Profile",
    status: "updated",
    action: {
      ko: "프로필 정보를 저장했습니다.",
      en: "Saved profile changes.",
    },
    occurredAt: timestamp,
  });

  return cloneState(nextProfile);
}
