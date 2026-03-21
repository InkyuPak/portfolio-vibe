import type { LocalizedText } from "@/lib/i18n";

export type ProjectStatus = "live" | "pilot" | "confidential";

export interface MetricRecord {
  label: LocalizedText;
  value: string;
  note?: LocalizedText;
}

export interface PrincipleRecord {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface StackBandRecord {
  id: string;
  label: LocalizedText;
  items: string[];
}

export interface ContactRecord {
  email: string;
  github: string;
  linkedin: string;
  blog: string;
}

export interface ProfileRecord {
  id: string;
  fullName: string;
  koreanName: string;
  title: LocalizedText;
  strapline: LocalizedText;
  intro: LocalizedText;
  location: LocalizedText;
  availability: LocalizedText;
  biography: LocalizedText[];
  specialties: LocalizedText[];
  principles: PrincipleRecord[];
  stackBands: StackBandRecord[];
  metrics: MetricRecord[];
  contact: ContactRecord;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  status: ProjectStatus;
  featured: boolean;
  title: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  client: LocalizedText;
  period: string;
  stack: string[];
  highlights: LocalizedText[];
  outcomes: MetricRecord[];
}

export interface ExperienceRecord {
  id: string;
  company: string;
  team: LocalizedText;
  role: LocalizedText;
  period: string;
  location: LocalizedText;
  summary: LocalizedText;
  achievements: LocalizedText[];
  stack: string[];
  current: boolean;
}

export interface WritingRecord {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: LocalizedText;
  publishedAt: string;
  readingTime: string;
}

export interface PortfolioSite {
  updatedAt: string;
  profile: ProfileRecord;
  projects: ProjectRecord[];
  experiences: ExperienceRecord[];
  writings: WritingRecord[];
}

export interface DashboardMetricRecord {
  id: string;
  label: LocalizedText;
  value: string;
  note: LocalizedText;
}

export interface DashboardActivityRecord {
  id: string;
  actor: string;
  target: string;
  status: "draft" | "published" | "updated";
  action: LocalizedText;
  occurredAt: string;
}

export interface TranslationStatusRecord {
  id: string;
  section: LocalizedText;
  localeCompletion: Record<"ko" | "en", number>;
  note: LocalizedText;
}

export interface ReleaseChecklistRecord {
  id: string;
  label: LocalizedText;
  done: boolean;
}

export interface AdminDashboardRecord {
  metrics: DashboardMetricRecord[];
  activity: DashboardActivityRecord[];
  translations: TranslationStatusRecord[];
  releaseChecklist: ReleaseChecklistRecord[];
}

export interface AdminProjectRecord extends ProjectRecord {
  updatedAt: string;
  revision: string;
}

export interface AdminExperienceRecord extends ExperienceRecord {
  updatedAt: string;
}

export interface AdminProfileRecord extends ProfileRecord {
  updatedAt: string;
  version: string;
}

export interface ProjectMutationInput {
  slug: string;
  status: ProjectStatus;
  featured: boolean;
  title: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  client: LocalizedText;
  period: string;
  stack: string[];
  highlights: LocalizedText[];
}

export interface ExperienceMutationInput {
  company: string;
  team: LocalizedText;
  role: LocalizedText;
  period: string;
  location: LocalizedText;
  summary: LocalizedText;
  achievements: LocalizedText[];
  stack: string[];
  current: boolean;
}

export interface ProfileMutationInput {
  fullName: string;
  koreanName: string;
  title: LocalizedText;
  strapline: LocalizedText;
  intro: LocalizedText;
  location: LocalizedText;
  availability: LocalizedText;
  biography: LocalizedText[];
  specialties: LocalizedText[];
}

export interface PortfolioApi {
  getPortfolioSite(): Promise<PortfolioSite>;
  getAdminDashboard(): Promise<AdminDashboardRecord>;
  getAdminProfile(): Promise<AdminProfileRecord>;
  updateAdminProfile(
    input: ProfileMutationInput,
  ): Promise<AdminProfileRecord>;
  listAdminProjects(): Promise<AdminProjectRecord[]>;
  createAdminProject(): Promise<AdminProjectRecord>;
  updateAdminProject(
    projectId: string,
    input: ProjectMutationInput,
  ): Promise<AdminProjectRecord>;
  listAdminExperience(): Promise<AdminExperienceRecord[]>;
  updateAdminExperience(
    experienceId: string,
    input: ExperienceMutationInput,
  ): Promise<AdminExperienceRecord>;
}

export interface MockPortfolioState {
  updatedAt: string;
  profile: AdminProfileRecord;
  projects: AdminProjectRecord[];
  experiences: AdminExperienceRecord[];
  writings: WritingRecord[];
  activity: DashboardActivityRecord[];
}
