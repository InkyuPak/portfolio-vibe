"use client";

import { useState } from "react";

import type {
  AdminProjectResponse,
  AdminProjectSectionResponse,
  ProjectRequest,
} from "@/lib/api/types";

interface ProjectStudioProps {
  initialProjects: AdminProjectResponse[];
}

interface ProjectDraft {
  id: number;
  slug: string;
  featured: boolean;
  themeColor: string;
  coverImageUrl: string;
  sortOrder: number;
  contextLabel: string;
  titleKo: string;
  titleEn: string;
  subtitleKo: string;
  subtitleEn: string;
  overviewKo: string;
  overviewEn: string;
  problemKo: string;
  problemEn: string;
  roleKo: string;
  roleEn: string;
  architectureKo: string;
  architectureEn: string;
  outcomeKo: string;
  outcomeEn: string;
  sectionsJson: string;
}

function toDraft(project: AdminProjectResponse): ProjectDraft {
  return {
    id: project.id,
    slug: project.slug,
    featured: project.featured,
    themeColor: project.themeColor ?? "#8b5cf6",
    coverImageUrl: project.coverImageUrl ?? "",
    sortOrder: project.sortOrder,
    contextLabel: project.contextLabel ?? "",
    titleKo: project.title.ko,
    titleEn: project.title.en ?? "",
    subtitleKo: project.subtitle.ko,
    subtitleEn: project.subtitle.en ?? "",
    overviewKo: project.overview.ko,
    overviewEn: project.overview.en ?? "",
    problemKo: project.problem.ko,
    problemEn: project.problem.en ?? "",
    roleKo: project.role.ko,
    roleEn: project.role.en ?? "",
    architectureKo: project.architecture.ko,
    architectureEn: project.architecture.en ?? "",
    outcomeKo: project.outcome.ko,
    outcomeEn: project.outcome.en ?? "",
    sectionsJson: JSON.stringify(project.sections, null, 2),
  };
}

function buildRequest(draft: ProjectDraft): ProjectRequest {
  const sections = JSON.parse(draft.sectionsJson) as AdminProjectSectionResponse[];

  return {
    slug: draft.slug,
    title: { ko: draft.titleKo, en: draft.titleEn },
    subtitle: { ko: draft.subtitleKo, en: draft.subtitleEn },
    overview: { ko: draft.overviewKo, en: draft.overviewEn },
    problem: { ko: draft.problemKo, en: draft.problemEn },
    role: { ko: draft.roleKo, en: draft.roleEn },
    architecture: { ko: draft.architectureKo, en: draft.architectureEn },
    outcome: { ko: draft.outcomeKo, en: draft.outcomeEn },
    featured: draft.featured,
    themeColor: draft.themeColor,
    coverImageUrl: draft.coverImageUrl,
    contextLabel: draft.contextLabel || undefined,
    sortOrder: draft.sortOrder,
    sections,
  };
}

function createNewProjectRequest(sortOrder: number): ProjectRequest {
  return {
    slug: `draft-${Date.now()}`,
    title: { ko: "새 프로젝트", en: "New Project" },
    subtitle: { ko: "프로젝트 부제", en: "Project subtitle" },
    overview: { ko: "프로젝트 개요", en: "Project overview" },
    problem: { ko: "문제 정의", en: "Problem statement" },
    role: { ko: "담당 역할", en: "Role and scope" },
    architecture: { ko: "아키텍처 판단", en: "Architecture decisions" },
    outcome: { ko: "성과 요약", en: "Outcome summary" },
    featured: false,
    themeColor: "#8b5cf6",
    coverImageUrl: "/images/project-testing-grid.svg",
    contextLabel: undefined,
    sortOrder,
    sections: [
      {
        type: "MARKDOWN",
        title: { ko: "설계 메모", en: "Design notes" },
        payload: {
          markdown: "- 핵심 설계 포인트를 이곳에 정리합니다.",
        },
        sortOrder: 1,
      },
    ],
  };
}

export function ProjectStudio({
  initialProjects,
}: ProjectStudioProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0]?.id ?? 0);
  const [draft, setDraft] = useState<ProjectDraft | null>(
    initialProjects[0] ? toDraft(initialProjects[0]) : null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function updateDraftField<K extends keyof ProjectDraft>(
    field: K,
    value: ProjectDraft[K],
  ) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  }

  function selectProject(project: AdminProjectResponse) {
    setSelectedId(project.id);
    setDraft(toDraft(project));
    setMessage(null);
  }

  async function createProject() {
    setBusy(true);
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createNewProjectRequest(projects.length + 1)),
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("새 프로젝트 생성에 실패했습니다.");
      return;
    }

    const created = (await response.json()) as AdminProjectResponse;
    setProjects((current) => [created, ...current]);
    selectProject(created);
    setMessage("새 프로젝트 초안을 생성했습니다.");
  }

  async function saveProject() {
    if (!draft) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(`/api/admin/projects/${draft.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildRequest(draft)),
      });

      if (!response.ok) {
        setMessage("프로젝트 저장에 실패했습니다.");
        return;
      }

      const saved = (await response.json()) as AdminProjectResponse;
      setProjects((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      );
      setDraft(toDraft(saved));
      setMessage("프로젝트를 저장했습니다.");
    } catch {
      setMessage("sections JSON 형식을 확인해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function publishProject() {
    if (!draft) {
      return;
    }

    setBusy(true);
    const response = await fetch(`/api/admin/projects/${draft.id}/publish`, {
      method: "POST",
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("프로젝트 게시에 실패했습니다.");
      return;
    }

    const published = (await response.json()) as AdminProjectResponse;
    setProjects((current) =>
      current.map((item) => (item.id === published.id ? published : item)),
    );
    setDraft(toDraft(published));
    setMessage("프로젝트를 게시했습니다.");
  }

  async function deleteProject() {
    if (!draft || !window.confirm("이 프로젝트를 삭제할까요?")) {
      return;
    }

    setBusy(true);
    const response = await fetch(`/api/admin/projects/${draft.id}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("프로젝트 삭제에 실패했습니다.");
      return;
    }

    const nextProjects = projects.filter((item) => item.id !== draft.id);
    setProjects(nextProjects);
    setDraft(nextProjects[0] ? toDraft(nextProjects[0]) : null);
    setSelectedId(nextProjects[0]?.id ?? 0);
    setMessage("프로젝트를 삭제했습니다.");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <button
          type="button"
          onClick={() => void createProject()}
          disabled={busy}
          className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
        >
          새 프로젝트
        </button>
        <div className="mt-4 grid gap-3">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => selectProject(project)}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedId === project.id
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.08]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] opacity-60">
                {project.status}
              </p>
              <p className="mt-2 font-semibold">{project.title.ko}</p>
              <p className="mt-2 text-sm opacity-70">{project.slug}</p>
            </button>
          ))}
        </div>
      </aside>

      {draft ? (
        <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
                Project Editor
              </p>
              <h2 className="mt-3 font-sans text-4xl text-white">{draft.titleKo}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveProject()}
                disabled={busy}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => void publishProject()}
                disabled={busy}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white"
              >
                게시
              </button>
              <button
                type="button"
                onClick={() => void deleteProject()}
                disabled={busy}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70"
              >
                삭제
              </button>
            </div>
          </div>

          {message ? <p className="mt-4 text-sm text-[#8b5cf6]">{message}</p> : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Slug", draft.slug, (value: string) => updateDraftField("slug", value)],
              [
                "Theme Color",
                draft.themeColor,
                (value: string) => updateDraftField("themeColor", value),
              ],
              [
                "Title (KO)",
                draft.titleKo,
                (value: string) => updateDraftField("titleKo", value),
              ],
              [
                "Title (EN)",
                draft.titleEn,
                (value: string) => updateDraftField("titleEn", value),
              ],
              [
                "Subtitle (KO)",
                draft.subtitleKo,
                (value: string) => updateDraftField("subtitleKo", value),
              ],
              [
                "Subtitle (EN)",
                draft.subtitleEn,
                (value: string) => updateDraftField("subtitleEn", value),
              ],
              [
                "Cover Image URL",
                draft.coverImageUrl,
                (value: string) => updateDraftField("coverImageUrl", value),
              ],
              [
                "Context Label",
                draft.contextLabel,
                (value: string) => updateDraftField("contextLabel", value),
              ],
            ].map(([label, value, onChange]) => (
              <label key={label as string} className="grid gap-2 text-sm text-white/72">
                <span>{label as string}</span>
                <input
                  value={value as string}
                  onChange={(event) => (onChange as (value: string) => void)(event.target.value)}
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white"
                />
              </label>
            ))}

            <label className="flex items-center gap-3 rounded-[1.3rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) =>
                  updateDraftField("featured", event.target.checked)
                }
              />
              대표 프로젝트 노출
            </label>
          </div>

          {[
            ["Overview (KO)", "overviewKo"],
            ["Overview (EN)", "overviewEn"],
            ["Problem (KO)", "problemKo"],
            ["Problem (EN)", "problemEn"],
            ["Role (KO)", "roleKo"],
            ["Role (EN)", "roleEn"],
            ["Architecture (KO)", "architectureKo"],
            ["Architecture (EN)", "architectureEn"],
            ["Outcome (KO)", "outcomeKo"],
            ["Outcome (EN)", "outcomeEn"],
          ].map(([label, key]) => (
            <label key={label} className="mt-4 grid gap-2 text-sm text-white/72">
              <span>{label}</span>
              <textarea
                rows={3}
                value={draft[key as keyof ProjectDraft] as string}
                onChange={(event) =>
                  updateDraftField(
                    key as keyof ProjectDraft,
                    event.target.value as ProjectDraft[keyof ProjectDraft],
                  )
                }
                className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 text-white"
              />
            </label>
          ))}

          <label className="mt-4 grid gap-2 text-sm text-white/72">
            <span>Sections JSON</span>
            <textarea
              rows={18}
              value={draft.sectionsJson}
              onChange={(event) =>
                updateDraftField("sectionsJson", event.target.value)
              }
              className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-white"
            />
          </label>
        </section>
      ) : null}
    </section>
  );
}
