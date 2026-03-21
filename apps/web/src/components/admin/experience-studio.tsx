"use client";

import { useState } from "react";

import type {
  AdminExperienceResponse,
  ExperienceRequest,
} from "@/lib/api/types";

interface ExperienceStudioProps {
  initialExperiences: AdminExperienceResponse[];
}

function toRequest(entry: AdminExperienceResponse): ExperienceRequest {
  return {
    companyName: entry.companyName,
    roleTitle: entry.roleTitle,
    summary: entry.summary,
    periodLabel: entry.periodLabel,
    highlights: entry.highlights,
    stackSummary: entry.stackSummary,
    location: entry.location ?? "",
    sortOrder: entry.sortOrder,
  };
}

export function ExperienceStudio({
  initialExperiences,
}: ExperienceStudioProps) {
  const [items, setItems] = useState(initialExperiences);
  const [selectedId, setSelectedId] = useState(initialExperiences[0]?.id ?? 0);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  async function createExperience() {
    setBusy(true);
    const response = await fetch("/api/admin/experience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: "새 회사",
        roleTitle: { ko: "새 역할", en: "New role" },
        summary: { ko: "경력 요약", en: "Experience summary" },
        periodLabel: { ko: "2025.01 - 현재", en: "Jan 2025 - Present" },
        highlights: { ko: "핵심 성과", en: "Key highlights" },
        stackSummary: "Spring Boot, PostgreSQL",
        location: "Seoul",
        sortOrder: items.length + 1,
      }),
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("경력 항목 생성에 실패했습니다.");
      return;
    }

    const created = (await response.json()) as AdminExperienceResponse;
    setItems((current) => [created, ...current]);
    setSelectedId(created.id);
    setMessage("새 경력 항목을 생성했습니다.");
  }

  async function saveExperience() {
    if (!selected) {
      return;
    }

    setBusy(true);
    const response = await fetch(`/api/admin/experience/${selected.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toRequest(selected)),
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("경력 저장에 실패했습니다.");
      return;
    }

    const saved = (await response.json()) as AdminExperienceResponse;
    setItems((current) =>
      current.map((item) => (item.id === saved.id ? saved : item)),
    );
    setMessage("경력 항목을 저장했습니다.");
  }

  async function deleteExperience() {
    if (!selected || !window.confirm("이 경력 항목을 삭제할까요?")) {
      return;
    }

    setBusy(true);
    const response = await fetch(`/api/admin/experience/${selected.id}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("경력 삭제에 실패했습니다.");
      return;
    }

    const next = items.filter((item) => item.id !== selected.id);
    setItems(next);
    setSelectedId(next[0]?.id ?? 0);
    setMessage("경력 항목을 삭제했습니다.");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <button
          type="button"
          onClick={() => void createExperience()}
          disabled={busy}
          className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
        >
          새 경력
        </button>
        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedId === item.id
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.08]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] opacity-60">
                {item.companyName}
              </p>
              <p className="mt-2 font-semibold">{item.roleTitle.ko}</p>
              <p className="mt-2 text-sm opacity-70">{item.periodLabel.ko}</p>
            </button>
          ))}
        </div>
      </aside>

      {selected ? (
        <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
                Experience Editor
              </p>
              <h2 className="mt-3 font-sans text-4xl text-white">
                {selected.roleTitle.ko}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveExperience()}
                disabled={busy}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => void deleteExperience()}
                disabled={busy}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/72"
              >
                삭제
              </button>
            </div>
          </div>

          {message ? <p className="mt-4 text-sm text-[#8b5cf6]">{message}</p> : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Company", selected.companyName, "companyName"],
              ["Role (KO)", selected.roleTitle.ko, "roleTitle.ko"],
              ["Role (EN)", selected.roleTitle.en ?? "", "roleTitle.en"],
              ["Period (KO)", selected.periodLabel.ko, "periodLabel.ko"],
              ["Period (EN)", selected.periodLabel.en ?? "", "periodLabel.en"],
              ["Location", selected.location ?? "", "location"],
              ["Stack Summary", selected.stackSummary, "stackSummary"],
            ].map(([label, value, key]) => (
              <label key={label as string} className="grid gap-2 text-sm text-white/72">
                <span>{label as string}</span>
                <input
                  value={value as string}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((item) =>
                        item.id !== selected.id
                          ? item
                          : key === "companyName"
                            ? { ...item, companyName: event.target.value }
                            : key === "location"
                              ? { ...item, location: event.target.value }
                              : key === "stackSummary"
                                ? { ...item, stackSummary: event.target.value }
                                : key === "roleTitle.ko"
                                  ? {
                                      ...item,
                                      roleTitle: {
                                        ...item.roleTitle,
                                        ko: event.target.value,
                                      },
                                    }
                                  : key === "roleTitle.en"
                                    ? {
                                        ...item,
                                        roleTitle: {
                                          ...item.roleTitle,
                                          en: event.target.value,
                                        },
                                      }
                                    : key === "periodLabel.ko"
                                      ? {
                                          ...item,
                                          periodLabel: {
                                            ...item.periodLabel,
                                            ko: event.target.value,
                                          },
                                        }
                                      : {
                                          ...item,
                                          periodLabel: {
                                            ...item.periodLabel,
                                            en: event.target.value,
                                          },
                                        },
                      ),
                    )
                  }
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white"
                />
              </label>
            ))}
          </div>

          {[
            ["Summary (KO)", selected.summary.ko, "summary.ko"],
            ["Summary (EN)", selected.summary.en ?? "", "summary.en"],
            ["Highlights (KO)", selected.highlights.ko, "highlights.ko"],
            ["Highlights (EN)", selected.highlights.en ?? "", "highlights.en"],
          ].map(([label, value, key]) => (
            <label key={label as string} className="mt-4 grid gap-2 text-sm text-white/72">
              <span>{label as string}</span>
              <textarea
                rows={4}
                value={value as string}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((item) =>
                      item.id !== selected.id
                        ? item
                        : key === "summary.ko"
                          ? {
                              ...item,
                              summary: { ...item.summary, ko: event.target.value },
                            }
                          : key === "summary.en"
                            ? {
                                ...item,
                                summary: { ...item.summary, en: event.target.value },
                              }
                            : key === "highlights.ko"
                              ? {
                                  ...item,
                                  highlights: {
                                    ...item.highlights,
                                    ko: event.target.value,
                                  },
                                }
                              : {
                                  ...item,
                                  highlights: {
                                    ...item.highlights,
                                    en: event.target.value,
                                  },
                                },
                    ),
                  )
                }
                className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 text-white"
              />
            </label>
          ))}
        </section>
      ) : null}
    </section>
  );
}
