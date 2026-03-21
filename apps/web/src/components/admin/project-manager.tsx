"use client";

import { useDeferredValue, useState, useTransition } from "react";

import type { Locale } from "@/lib/i18n";
import { translate } from "@/lib/i18n";
import type {
  AdminProjectRecord,
  ProjectMutationInput,
  ProjectStatus,
} from "@/lib/portfolio/contracts";
import {
  flattenLocalizedEntries,
  pairLocalizedEntries,
} from "@/lib/portfolio/editor-utils";
import { cn, splitLines } from "@/lib/utils";

interface ProjectManagerProps {
  initialProjects: AdminProjectRecord[];
  locale: Locale;
}

interface EditableProject {
  id: string;
  slug: string;
  status: ProjectStatus;
  featured: boolean;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
  roleKo: string;
  roleEn: string;
  clientKo: string;
  clientEn: string;
  period: string;
  stack: string;
  highlightsKo: string;
  highlightsEn: string;
}

const copy = {
  ko: {
    search: "프로젝트 검색",
    newDraft: "새 초안",
    save: "저장",
    saving: "저장 중...",
    slug: "슬러그",
    period: "기간",
    status: "상태",
    featured: "대표 노출",
    titleKo: "제목 (KO)",
    titleEn: "Title (EN)",
    summaryKo: "요약 (KO)",
    summaryEn: "Summary (EN)",
    roleKo: "역할 (KO)",
    roleEn: "Role (EN)",
    clientKo: "조직 (KO)",
    clientEn: "Client (EN)",
    stack: "기술 스택",
    stackHint: "쉼표로 구분",
    highlightsKo: "하이라이트 (KO)",
    highlightsEn: "Highlights (EN)",
    highlightsHint: "한 줄에 하나씩 입력",
    preview: "미리보기",
    updated: "최근 수정",
    searchPlaceholder: "제목, 스택, 상태",
    saved: "프로젝트가 저장되었습니다.",
    created: "새 프로젝트 초안이 생성되었습니다.",
    failed: "저장 중 오류가 발생했습니다.",
  },
  en: {
    search: "Search projects",
    newDraft: "New draft",
    save: "Save",
    saving: "Saving...",
    slug: "Slug",
    period: "Period",
    status: "Status",
    featured: "Featured",
    titleKo: "Title (KO)",
    titleEn: "Title (EN)",
    summaryKo: "Summary (KO)",
    summaryEn: "Summary (EN)",
    roleKo: "Role (KO)",
    roleEn: "Role (EN)",
    clientKo: "Client (KO)",
    clientEn: "Client (EN)",
    stack: "Stack",
    stackHint: "Comma separated",
    highlightsKo: "Highlights (KO)",
    highlightsEn: "Highlights (EN)",
    highlightsHint: "One item per line",
    preview: "Preview",
    updated: "Last updated",
    searchPlaceholder: "Title, stack, status",
    saved: "Project changes saved.",
    created: "Created a new project draft.",
    failed: "Something went wrong while saving.",
  },
} as const;

const statusOptions: ProjectStatus[] = ["live", "pilot", "confidential"];

function toEditableProject(project: AdminProjectRecord): EditableProject {
  const highlights = flattenLocalizedEntries(project.highlights);

  return {
    id: project.id,
    slug: project.slug,
    status: project.status,
    featured: project.featured,
    titleKo: project.title.ko,
    titleEn: project.title.en,
    summaryKo: project.summary.ko,
    summaryEn: project.summary.en,
    roleKo: project.role.ko,
    roleEn: project.role.en,
    clientKo: project.client.ko,
    clientEn: project.client.en,
    period: project.period,
    stack: project.stack.join(", "),
    highlightsKo: highlights.ko,
    highlightsEn: highlights.en,
  };
}

function toProjectPayload(draft: EditableProject): ProjectMutationInput {
  return {
    slug: draft.slug,
    status: draft.status,
    featured: draft.featured,
    title: {
      ko: draft.titleKo,
      en: draft.titleEn,
    },
    summary: {
      ko: draft.summaryKo,
      en: draft.summaryEn,
    },
    role: {
      ko: draft.roleKo,
      en: draft.roleEn,
    },
    client: {
      ko: draft.clientKo,
      en: draft.clientEn,
    },
    period: draft.period,
    stack: draft.stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    highlights: pairLocalizedEntries(draft.highlightsKo, draft.highlightsEn),
  };
}

function formatTimestamp(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm text-white/72">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-white/42">{hint}</span> : null}
    </label>
  );
}

export function ProjectManager({
  initialProjects,
  locale,
}: ProjectManagerProps) {
  const labels = copy[locale];
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0]?.id ?? "");
  const [draft, setDraft] = useState(
    initialProjects[0] ? toEditableProject(initialProjects[0]) : null,
  );
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredProjects = projects.filter((project) => {
    if (!deferredQuery.trim()) {
      return true;
    }

    const haystack = [
      project.title.ko,
      project.title.en,
      project.summary.ko,
      project.summary.en,
      project.status,
      ...project.stack,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredQuery.toLowerCase());
  });

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? projects[0];

  async function createDraft() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/projects", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create a project draft");
        }

        const created = (await response.json()) as AdminProjectRecord;
        setProjects((current) => [created, ...current]);
        setSelectedId(created.id);
        setDraft(toEditableProject(created));
        setMessage(labels.created);
      } catch {
        setMessage(labels.failed);
      }
    });
  }

  async function saveProject() {
    if (!draft) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/projects/${draft.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toProjectPayload(draft)),
        });

        if (!response.ok) {
          throw new Error("Failed to save project");
        }

        const updated = (await response.json()) as AdminProjectRecord;
        setProjects((current) =>
          current.map((project) => (project.id === updated.id ? updated : project)),
        );
        setDraft(toEditableProject(updated));
        setMessage(labels.saved);
      } catch {
        setMessage(labels.failed);
      }
    });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center justify-between gap-4">
          <Field label={labels.search}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <button
            type="button"
            onClick={createDraft}
            disabled={isPending}
            className="mt-6 shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
          >
            {labels.newDraft}
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          {filteredProjects.map((project) => {
            const active = project.id === selectedProject?.id;

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setSelectedId(project.id);
                  setDraft(toEditableProject(project));
                  setMessage(null);
                }}
                className={cn(
                  "rounded-[1.5rem] border px-4 py-4 text-left transition",
                  active
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]"
                    : "border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.08]",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">
                    {translate(project.title, locale)}
                  </p>
                  <span className="text-[11px] uppercase tracking-[0.24em] opacity-60">
                    {project.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 opacity-70">
                  {translate(project.summary, locale)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((item) => (
                    <span
                      key={`${project.id}-${item}`}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px]",
                        active
                          ? "border-black/10 bg-black/5 text-black/58"
                          : "border-white/10 bg-black/20 text-white/50",
                      )}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="grid gap-6">
        {draft ? (
          <>
            <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
                    {labels.preview}
                  </p>
                  <h2 className="mt-4 font-sans text-4xl text-white">
                    {locale === "ko" ? draft.titleKo || "새 프로젝트" : draft.titleEn || "New project"}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
                    {locale === "ko" ? draft.summaryKo : draft.summaryEn}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/60">
                    {labels.updated}:{" "}
                    {selectedProject
                      ? formatTimestamp(selectedProject.updatedAt, locale)
                      : "-"}
                  </span>
                  <button
                    type="button"
                    onClick={saveProject}
                    disabled={isPending}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
                  >
                    {isPending ? labels.saving : labels.save}
                  </button>
                </div>
              </div>

              {message ? (
                <p className="mt-4 text-sm text-[#8b5cf6]">{message}</p>
              ) : null}
            </section>

            <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={labels.slug}>
                  <input
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, slug: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <Field label={labels.period}>
                  <input
                    value={draft.period}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, period: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <Field label={labels.status}>
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              status: event.target.value as ProjectStatus,
                            }
                          : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="bg-[#0d1218]">
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>

                <label className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, featured: event.target.checked }
                          : current,
                      )
                    }
                    className="h-4 w-4 rounded border-white/20 bg-transparent"
                  />
                  <span>{labels.featured}</span>
                </label>

                <Field label={labels.titleKo}>
                  <input
                    value={draft.titleKo}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, titleKo: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>
                <Field label={labels.titleEn}>
                  <input
                    value={draft.titleEn}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, titleEn: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <Field label={labels.summaryKo}>
                  <textarea
                    value={draft.summaryKo}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, summaryKo: event.target.value }
                          : current,
                      )
                    }
                    rows={5}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>
                <Field label={labels.summaryEn}>
                  <textarea
                    value={draft.summaryEn}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, summaryEn: event.target.value }
                          : current,
                      )
                    }
                    rows={5}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <Field label={labels.roleKo}>
                  <input
                    value={draft.roleKo}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, roleKo: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>
                <Field label={labels.roleEn}>
                  <input
                    value={draft.roleEn}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, roleEn: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <Field label={labels.clientKo}>
                  <input
                    value={draft.clientKo}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, clientKo: event.target.value }
                          : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>
                <Field label={labels.clientEn}>
                  <input
                    value={draft.clientEn}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, clientEn: event.target.value }
                          : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <Field label={labels.stack} hint={labels.stackHint}>
                  <input
                    value={draft.stack}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, stack: event.target.value } : current,
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                  <p className="font-medium text-white/75">
                    {locale === "ko" ? "하이라이트 개수" : "Highlight count"}
                  </p>
                  <p className="mt-3 font-sans text-4xl text-white">
                    {Math.max(
                      splitLines(draft.highlightsKo).length,
                      splitLines(draft.highlightsEn).length,
                    )}
                  </p>
                </div>

                <Field label={labels.highlightsKo} hint={labels.highlightsHint}>
                  <textarea
                    value={draft.highlightsKo}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, highlightsKo: event.target.value }
                          : current,
                      )
                    }
                    rows={6}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>
                <Field label={labels.highlightsEn} hint={labels.highlightsHint}>
                  <textarea
                    value={draft.highlightsEn}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, highlightsEn: event.target.value }
                          : current,
                      )
                    }
                    rows={6}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
                  />
                </Field>
              </div>
            </section>
          </>
        ) : (
          <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white/60">
            {locale === "ko"
              ? "편집할 프로젝트가 없습니다."
              : "There is no project to edit yet."}
          </section>
        )}
      </div>
    </section>
  );
}
