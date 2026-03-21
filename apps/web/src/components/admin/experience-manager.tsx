"use client";

import { useState, useTransition } from "react";

import type { Locale } from "@/lib/i18n";
import { translate } from "@/lib/i18n";
import type {
  AdminExperienceRecord,
  ExperienceMutationInput,
} from "@/lib/portfolio/contracts";
import {
  flattenLocalizedEntries,
  pairLocalizedEntries,
} from "@/lib/portfolio/editor-utils";
import { cn } from "@/lib/utils";

interface ExperienceManagerProps {
  initialExperiences: AdminExperienceRecord[];
  locale: Locale;
}

interface EditableExperience {
  id: string;
  company: string;
  teamKo: string;
  teamEn: string;
  roleKo: string;
  roleEn: string;
  period: string;
  locationKo: string;
  locationEn: string;
  summaryKo: string;
  summaryEn: string;
  achievementsKo: string;
  achievementsEn: string;
  stack: string;
  current: boolean;
}

const copy = {
  ko: {
    save: "저장",
    saving: "저장 중...",
    company: "회사",
    teamKo: "팀 (KO)",
    teamEn: "Team (EN)",
    roleKo: "직무 (KO)",
    roleEn: "Role (EN)",
    period: "기간",
    locationKo: "위치 (KO)",
    locationEn: "Location (EN)",
    summaryKo: "요약 (KO)",
    summaryEn: "Summary (EN)",
    achievementsKo: "성과 (KO)",
    achievementsEn: "Achievements (EN)",
    achievementsHint: "한 줄에 하나씩 입력",
    stack: "기술 스택",
    current: "현재 역할",
    saved: "경력 항목이 저장되었습니다.",
    failed: "경력 항목 저장에 실패했습니다.",
  },
  en: {
    save: "Save",
    saving: "Saving...",
    company: "Company",
    teamKo: "Team (KO)",
    teamEn: "Team (EN)",
    roleKo: "Role (KO)",
    roleEn: "Role (EN)",
    period: "Period",
    locationKo: "Location (KO)",
    locationEn: "Location (EN)",
    summaryKo: "Summary (KO)",
    summaryEn: "Summary (EN)",
    achievementsKo: "Achievements (KO)",
    achievementsEn: "Achievements (EN)",
    achievementsHint: "One item per line",
    stack: "Stack",
    current: "Current role",
    saved: "Experience entry saved.",
    failed: "Failed to save the experience entry.",
  },
} as const;

function toEditableExperience(
  experience: AdminExperienceRecord,
): EditableExperience {
  const achievements = flattenLocalizedEntries(experience.achievements);

  return {
    id: experience.id,
    company: experience.company,
    teamKo: experience.team.ko,
    teamEn: experience.team.en,
    roleKo: experience.role.ko,
    roleEn: experience.role.en,
    period: experience.period,
    locationKo: experience.location.ko,
    locationEn: experience.location.en,
    summaryKo: experience.summary.ko,
    summaryEn: experience.summary.en,
    achievementsKo: achievements.ko,
    achievementsEn: achievements.en,
    stack: experience.stack.join(", "),
    current: experience.current,
  };
}

function toExperiencePayload(
  draft: EditableExperience,
): ExperienceMutationInput {
  return {
    company: draft.company,
    team: {
      ko: draft.teamKo,
      en: draft.teamEn,
    },
    role: {
      ko: draft.roleKo,
      en: draft.roleEn,
    },
    period: draft.period,
    location: {
      ko: draft.locationKo,
      en: draft.locationEn,
    },
    summary: {
      ko: draft.summaryKo,
      en: draft.summaryEn,
    },
    achievements: pairLocalizedEntries(
      draft.achievementsKo,
      draft.achievementsEn,
    ),
    stack: draft.stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    current: draft.current,
  };
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

export function ExperienceManager({
  initialExperiences,
  locale,
}: ExperienceManagerProps) {
  const labels = copy[locale];
  const [experiences, setExperiences] = useState(initialExperiences);
  const [selectedId, setSelectedId] = useState(initialExperiences[0]?.id ?? "");
  const [draft, setDraft] = useState(
    initialExperiences[0] ? toEditableExperience(initialExperiences[0]) : null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function saveExperience() {
    if (!draft) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/experiences/${draft.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toExperiencePayload(draft)),
        });

        if (!response.ok) {
          throw new Error("Failed to save experience");
        }

        const updated = (await response.json()) as AdminExperienceRecord;
        setExperiences((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        setDraft(toEditableExperience(updated));
        setSelectedId(updated.id);
        setMessage(labels.saved);
      } catch {
        setMessage(labels.failed);
      }
    });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="grid gap-3">
          {experiences.map((experience) => {
            const active = experience.id === selectedId;

            return (
              <button
                key={experience.id}
                type="button"
                onClick={() => {
                  setSelectedId(experience.id);
                  setDraft(toEditableExperience(experience));
                  setMessage(null);
                }}
                className={cn(
                  "rounded-[1.5rem] border px-4 py-4 text-left transition",
                  active
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]"
                    : "border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.08]",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-60">
                  {experience.company}
                </p>
                <p className="mt-2 font-semibold">
                  {translate(experience.role, locale)}
                </p>
                <p className="mt-2 text-sm opacity-70">{experience.period}</p>
              </button>
            );
          })}
        </div>
      </aside>

      {draft ? (
        <div className="grid gap-6">
          <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
                  {draft.company}
                </p>
                <h2 className="mt-4 font-sans text-4xl text-white">
                  {locale === "ko" ? draft.roleKo : draft.roleEn}
                </h2>
                <p className="mt-3 text-sm text-white/55">
                  {locale === "ko" ? draft.teamKo : draft.teamEn}
                </p>
              </div>

              <button
                type="button"
                onClick={saveExperience}
                disabled={isPending}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
              >
                {isPending ? labels.saving : labels.save}
              </button>
            </div>

            {message ? (
              <p className="mt-4 text-sm text-[#8b5cf6]">{message}</p>
            ) : null}
          </section>

          <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label={labels.company}>
                <input
                  value={draft.company}
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, company: event.target.value } : current,
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

              <Field label={labels.teamKo}>
                <input
                  value={draft.teamKo}
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, teamKo: event.target.value } : current,
                    )
                  }
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                />
              </Field>
              <Field label={labels.teamEn}>
                <input
                  value={draft.teamEn}
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, teamEn: event.target.value } : current,
                    )
                  }
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
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

              <Field label={labels.locationKo}>
                <input
                  value={draft.locationKo}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, locationKo: event.target.value }
                        : current,
                    )
                  }
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
                />
              </Field>
              <Field label={labels.locationEn}>
                <input
                  value={draft.locationEn}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, locationEn: event.target.value }
                        : current,
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

              <Field label={labels.achievementsKo} hint={labels.achievementsHint}>
                <textarea
                  value={draft.achievementsKo}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, achievementsKo: event.target.value }
                        : current,
                    )
                  }
                  rows={6}
                  className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
                />
              </Field>
              <Field label={labels.achievementsEn} hint={labels.achievementsHint}>
                <textarea
                  value={draft.achievementsEn}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, achievementsEn: event.target.value }
                        : current,
                    )
                  }
                  rows={6}
                  className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
                />
              </Field>

              <Field label={labels.stack}>
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

              <label className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72">
                <input
                  type="checkbox"
                  checked={draft.current}
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, current: event.target.checked } : current,
                    )
                  }
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span>{labels.current}</span>
              </label>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
