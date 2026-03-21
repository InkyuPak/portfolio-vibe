import type {
  AdminDashboardRecord,
  AdminExperienceRecord,
  AdminProfileRecord,
  AdminProjectRecord,
  ExperienceMutationInput,
  PortfolioApi,
  PortfolioSite,
  ProfileMutationInput,
  ProjectMutationInput,
} from "@/lib/portfolio/contracts";
import {
  createAdminProjectSnapshot,
  getAdminDashboardSnapshot,
  getAdminProfileSnapshot,
  getPortfolioSiteSnapshot,
  listAdminExperienceSnapshot,
  listAdminProjectsSnapshot,
  updateAdminExperienceSnapshot,
  updateAdminProfileSnapshot,
  updateAdminProjectSnapshot,
} from "@/lib/portfolio/mock-store";

export type ApiMode = "mock" | "live";

export interface PortfolioApiOptions {
  mode?: ApiMode;
  baseUrl?: string;
  fetcher?: typeof fetch;
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function resolvePortfolioApiMode(
  env: NodeJS.ProcessEnv = process.env,
): ApiMode {
  const explicit = env.PORTFOLIO_API_MODE ?? env.NEXT_PUBLIC_PORTFOLIO_API_MODE;

  if (explicit === "live" || explicit === "mock") {
    return explicit;
  }

  return env.PORTFOLIO_API_BASE_URL ? "live" : "mock";
}

async function requestJson<T>(
  fetcher: typeof fetch,
  baseUrl: string,
  path: string,
  init?: RequestInit,
) {
  const response = await fetcher(`${stripTrailingSlash(baseUrl)}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Portfolio API request failed: ${response.status} ${path}`);
  }

  return (await response.json()) as T;
}

function createMockPortfolioApi(): PortfolioApi {
  return {
    getPortfolioSite: async () => getPortfolioSiteSnapshot(),
    getAdminDashboard: async () => getAdminDashboardSnapshot(),
    getAdminProfile: async () => getAdminProfileSnapshot(),
    updateAdminProfile: async (input: ProfileMutationInput) =>
      updateAdminProfileSnapshot(input),
    listAdminProjects: async () => listAdminProjectsSnapshot(),
    createAdminProject: async () => createAdminProjectSnapshot(),
    updateAdminProject: async (projectId: string, input: ProjectMutationInput) =>
      updateAdminProjectSnapshot(projectId, input),
    listAdminExperience: async () => listAdminExperienceSnapshot(),
    updateAdminExperience: async (
      experienceId: string,
      input: ExperienceMutationInput,
    ) => updateAdminExperienceSnapshot(experienceId, input),
  };
}

function createLivePortfolioApi({
  baseUrl,
  fetcher = fetch,
}: Required<Pick<PortfolioApiOptions, "baseUrl">> &
  Pick<PortfolioApiOptions, "fetcher">): PortfolioApi {
  return {
    getPortfolioSite: () =>
      requestJson<PortfolioSite>(fetcher, baseUrl, "/api/v1/portfolio"),
    getAdminDashboard: () =>
      requestJson<AdminDashboardRecord>(fetcher, baseUrl, "/api/v1/admin/dashboard"),
    getAdminProfile: () =>
      requestJson<AdminProfileRecord>(fetcher, baseUrl, "/api/v1/admin/profile"),
    updateAdminProfile: (input: ProfileMutationInput) =>
      requestJson<AdminProfileRecord>(fetcher, baseUrl, "/api/v1/admin/profile", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    listAdminProjects: () =>
      requestJson<AdminProjectRecord[]>(fetcher, baseUrl, "/api/v1/admin/projects"),
    createAdminProject: () =>
      requestJson<AdminProjectRecord>(fetcher, baseUrl, "/api/v1/admin/projects", {
        method: "POST",
      }),
    updateAdminProject: (projectId: string, input: ProjectMutationInput) =>
      requestJson<AdminProjectRecord>(
        fetcher,
        baseUrl,
        `/api/v1/admin/projects/${projectId}`,
        {
          method: "PUT",
          body: JSON.stringify(input),
        },
      ),
    listAdminExperience: () =>
      requestJson<AdminExperienceRecord[]>(
        fetcher,
        baseUrl,
        "/api/v1/admin/experiences",
      ),
    updateAdminExperience: (
      experienceId: string,
      input: ExperienceMutationInput,
    ) =>
      requestJson<AdminExperienceRecord>(
        fetcher,
        baseUrl,
        `/api/v1/admin/experiences/${experienceId}`,
        {
          method: "PUT",
          body: JSON.stringify(input),
        },
      ),
  };
}

export function createPortfolioApi(
  options: PortfolioApiOptions = {},
): PortfolioApi {
  const mode = options.mode ?? resolvePortfolioApiMode();

  if (mode === "mock") {
    return createMockPortfolioApi();
  }

  const baseUrl = options.baseUrl ?? process.env.PORTFOLIO_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("PORTFOLIO_API_BASE_URL is required for live mode");
  }

  return createLivePortfolioApi({
    baseUrl,
    fetcher: options.fetcher,
  });
}

export function getPortfolioApi(options?: PortfolioApiOptions) {
  return createPortfolioApi(options);
}
