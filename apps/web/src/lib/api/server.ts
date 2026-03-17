import type {
  ContactMessageResponse,
  ProblemResponse,
  PublicExperienceResponse,
  PublicProjectDetailResponse,
  PublicProjectSummaryResponse,
  PublicSkillGroupResponse,
  PublicEducationResponse,
  PublicAwardResponse,
  ResumeAssetResponse,
  SessionResponse,
  SiteOverviewResponse,
  AdminAchievementResponse,
  AdminExperienceResponse,
  AdminProjectResponse,
  AdminSiteSettingsResponse,
  AdminSkillGroupResponse,
  MediaAssetResponse,
} from "@/lib/api/types";

function resolveApiBaseUrl() {
  return (
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080"
  ).replace(/\/+$/, "");
}

async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  cookieHeader?: string,
): Promise<T> {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const errorBody = contentType.includes("application/json")
      ? ((await response.json()) as ProblemResponse)
      : undefined;

    const message =
      errorBody?.detail ??
      errorBody?.title ??
      `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function getSiteOverview(locale: "ko" | "en") {
  return apiRequest<SiteOverviewResponse>(`/api/public/site-settings?lang=${locale}`);
}

export function getProjects(locale: "ko" | "en", featured = false) {
  return apiRequest<PublicProjectSummaryResponse[]>(
    `/api/public/projects?lang=${locale}&featured=${featured}`,
  );
}

export function getProject(locale: "ko" | "en", slug: string) {
  return apiRequest<PublicProjectDetailResponse>(
    `/api/public/projects/${slug}?lang=${locale}`,
  );
}

export function getExperience(locale: "ko" | "en") {
  return apiRequest<PublicExperienceResponse[]>(
    `/api/public/experience?lang=${locale}`,
  );
}

export function getSkills(locale: "ko" | "en") {
  return apiRequest<PublicSkillGroupResponse[]>(
    `/api/public/skills?lang=${locale}`,
  );
}

export function getResumes(locale: "ko" | "en") {
  return apiRequest<ResumeAssetResponse[]>(`/api/public/resume?lang=${locale}`);
}

export function getEducation(locale: "ko" | "en") {
  return apiRequest<PublicEducationResponse[]>(`/api/public/education?lang=${locale}`);
}

export function getAwards(locale: "ko" | "en") {
  return apiRequest<PublicAwardResponse[]>(`/api/public/awards?lang=${locale}`);
}

export function getAdminSession(cookieHeader: string) {
  return apiRequest<SessionResponse>("/api/admin/auth/me", undefined, cookieHeader);
}

export function getAdminSiteSettings(cookieHeader: string) {
  return apiRequest<AdminSiteSettingsResponse>(
    "/api/admin/site-settings",
    undefined,
    cookieHeader,
  );
}

export function getAdminAchievements(cookieHeader: string) {
  return apiRequest<AdminAchievementResponse[]>(
    "/api/admin/achievements",
    undefined,
    cookieHeader,
  );
}

export function getAdminResumes(cookieHeader: string) {
  return apiRequest<ResumeAssetResponse[]>("/api/admin/resume", undefined, cookieHeader);
}

export function getAdminProjects(cookieHeader: string) {
  return apiRequest<AdminProjectResponse[]>("/api/admin/projects", undefined, cookieHeader);
}

export function getAdminExperience(cookieHeader: string) {
  return apiRequest<AdminExperienceResponse[]>(
    "/api/admin/experience",
    undefined,
    cookieHeader,
  );
}

export function getAdminSkills(cookieHeader: string) {
  return apiRequest<AdminSkillGroupResponse[]>(
    "/api/admin/skills",
    undefined,
    cookieHeader,
  );
}

export function getAdminMedia(cookieHeader: string) {
  return apiRequest<MediaAssetResponse[]>("/api/admin/media", undefined, cookieHeader);
}

export function getAdminContactMessages(cookieHeader: string) {
  return apiRequest<ContactMessageResponse[]>(
    "/api/admin/contact-messages",
    undefined,
    cookieHeader,
  );
}
