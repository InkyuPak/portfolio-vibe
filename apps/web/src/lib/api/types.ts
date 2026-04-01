export interface LocalizedTextPayload {
  ko: string;
  en?: string | null;
}

export interface PublicSiteSettingsResponse {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  contactEmail: string;
  contactPhone?: string | null;
  githubUrl?: string | null;
  linkedInUrl?: string | null;
}

export interface PublicAchievementResponse {
  title: string;
  summary: string;
  metric: string;
  accent?: string | null;
}

export interface ResumeAssetResponse {
  id: number;
  languageCode: string;
  label: string;
  fileName: string;
  fileUrl: string;
}

export interface SiteOverviewResponse {
  site: PublicSiteSettingsResponse;
  achievements: PublicAchievementResponse[];
  resumes: ResumeAssetResponse[];
}

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

export interface PublicProjectSectionResponse {
  type: "MARKDOWN" | "METRICS" | "DIAGRAM" | "GALLERY" | "TIMELINE";
  title: string;
  payload: Record<string, unknown>;
  sortOrder: number;
}

export interface PublicProjectDetailResponse
  extends PublicProjectSummaryResponse {
  problem: string;
  role: string;
  architecture: string;
  outcome: string;
  sections: PublicProjectSectionResponse[];
}

export interface PublicExperienceResponse {
  id: number;
  companyName: string;
  roleTitle: string;
  summary: string;
  periodLabel: string;
  highlights: string[];
  stackSummary: string;
  location?: string | null;
}

export interface PublicSkillItemResponse {
  name: string;
  description: string;
  sortOrder: number;
}

export interface PublicSkillGroupResponse {
  groupKey: string;
  title: string;
  items: PublicSkillItemResponse[];
}

export interface PublicEducationResponse {
  institutionName: string;
  degree: string;
  major: string;
  periodLabel: string;
}

export interface PublicAwardResponse {
  awardType: string;
  title: string;
  issuer: string;
  periodLabel: string;
  description?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SessionResponse {
  username: string;
  displayName: string;
  authenticated: boolean;
}

export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export interface AdminSiteSettingsResponse {
  id: number;
  heroTitle: LocalizedTextPayload;
  heroSubtitle: LocalizedTextPayload;
  heroDescription: LocalizedTextPayload;
  contactEmail: string;
  contactPhone?: string | null;
  githubUrl?: string | null;
  linkedInUrl?: string | null;
}

export interface SiteSettingsRequest {
  heroTitle: LocalizedTextPayload;
  heroSubtitle: LocalizedTextPayload;
  heroDescription: LocalizedTextPayload;
  contactEmail: string;
  contactPhone?: string;
  githubUrl?: string;
  linkedInUrl?: string;
}

export interface AdminAchievementResponse {
  id: number;
  title: LocalizedTextPayload;
  summary: LocalizedTextPayload;
  metric: string;
  accent?: string | null;
  status: string;
  sortOrder: number;
}

export interface AchievementRequest {
  title: LocalizedTextPayload;
  summary: LocalizedTextPayload;
  metric: string;
  accent?: string;
  sortOrder: number;
}

export interface AdminProjectSectionResponse {
  id?: number | null;
  type: "MARKDOWN" | "METRICS" | "DIAGRAM" | "GALLERY" | "TIMELINE";
  title: LocalizedTextPayload;
  payload: Record<string, unknown>;
  sortOrder: number;
}

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

export interface AdminExperienceResponse {
  id: number;
  companyName: string;
  roleTitle: LocalizedTextPayload;
  summary: LocalizedTextPayload;
  periodLabel: LocalizedTextPayload;
  highlights: LocalizedTextPayload;
  stackSummary: string;
  location?: string | null;
  status: string;
  sortOrder: number;
}

export interface ExperienceRequest {
  companyName: string;
  roleTitle: LocalizedTextPayload;
  summary: LocalizedTextPayload;
  periodLabel: LocalizedTextPayload;
  highlights: LocalizedTextPayload;
  stackSummary: string;
  location?: string;
  sortOrder: number;
}

export interface AdminSkillItemResponse {
  id?: number | null;
  name: string;
  description: LocalizedTextPayload;
  sortOrder: number;
}

export interface AdminSkillGroupResponse {
  id: number;
  groupKey: string;
  title: LocalizedTextPayload;
  status: string;
  sortOrder: number;
  items: AdminSkillItemResponse[];
}

export interface SkillGroupRequest {
  groupKey: string;
  title: LocalizedTextPayload;
  items: AdminSkillItemResponse[];
  sortOrder: number;
}

export interface MediaAssetResponse {
  id: number;
  originalFileName: string;
  contentType: string;
  size: number;
  publicUrl: string;
  altKo?: string | null;
  altEn?: string | null;
  captionKo?: string | null;
  captionEn?: string | null;
  createdAt: string;
}

export interface ProblemResponse {
  title?: string;
  detail?: string;
  status?: number;
  path?: string;
  errors?: Record<string, string>;
}
