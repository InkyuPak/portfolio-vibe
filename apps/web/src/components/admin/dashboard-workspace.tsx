"use client";

import { useState } from "react";

import type {
  AdminAchievementResponse,
  AdminSiteSettingsResponse,
  ContactMessageResponse,
  MediaAssetResponse,
  ResumeAssetResponse,
  SiteSettingsRequest,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface DashboardWorkspaceProps {
  initialSettings: AdminSiteSettingsResponse;
  initialAchievements: AdminAchievementResponse[];
  initialResumes: ResumeAssetResponse[];
  initialMedia: MediaAssetResponse[];
  initialMessages: ContactMessageResponse[];
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="max-w-3xl">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-white/50">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function DashboardWorkspace({
  initialSettings,
  initialAchievements,
  initialResumes,
  initialMedia,
  initialMessages,
}: DashboardWorkspaceProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [resumes, setResumes] = useState(initialResumes);
  const [media, setMedia] = useState(initialMedia);
  const [messages] = useState(initialMessages);
  const [siteMessage, setSiteMessage] = useState<string | null>(null);
  const [assetMessage, setAssetMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    altKo: "",
    altEn: "",
    captionKo: "",
    captionEn: "",
  });

  function updateContactField(
    field: "contactEmail" | "contactPhone" | "githubUrl" | "linkedInUrl",
    value: string,
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveSettings() {
    const payload: SiteSettingsRequest = {
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroDescription: settings.heroDescription,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone ?? "",
      githubUrl: settings.githubUrl ?? "",
      linkedInUrl: settings.linkedInUrl ?? "",
    };

    const response = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setSiteMessage("사이트 설정 저장에 실패했습니다.");
      return;
    }

    setSettings((await response.json()) as AdminSiteSettingsResponse);
    setSiteMessage("사이트 설정을 저장했습니다.");
  }

  async function saveAchievement(item: AdminAchievementResponse) {
    const method = item.id < 0 ? "POST" : "PUT";
    const path =
      item.id < 0
        ? "/api/admin/achievements"
        : `/api/admin/achievements/${item.id}`;
    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: item.title,
        summary: item.summary,
        metric: item.metric,
        accent: item.accent,
        sortOrder: item.sortOrder,
      }),
    });

    if (!response.ok) {
      setAssetMessage("성과 저장에 실패했습니다.");
      return;
    }

    const saved = (await response.json()) as AdminAchievementResponse;
    setAchievements((current) => {
      const next = current.filter((entry) => entry.id !== item.id);
      return [...next, saved].sort((a, b) => a.sortOrder - b.sortOrder);
    });
    setAssetMessage("성과를 저장했습니다.");
  }

  async function deleteAchievement(id: number) {
    const response = await fetch(`/api/admin/achievements/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setAssetMessage("성과 삭제에 실패했습니다.");
      return;
    }

    setAchievements((current) => current.filter((entry) => entry.id !== id));
    setAssetMessage("성과를 삭제했습니다.");
  }

  async function saveResume(item: ResumeAssetResponse) {
    const response = await fetch("/api/admin/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode: item.languageCode,
        label: {
          ko: item.label,
          en: item.label,
        },
        fileName: item.fileName,
        fileUrl: item.fileUrl,
        sortOrder: 1,
      }),
    });

    if (!response.ok) {
      setAssetMessage("이력서 저장에 실패했습니다.");
      return;
    }

    const saved = (await response.json()) as ResumeAssetResponse;
    setResumes((current) => {
      const next = current.filter(
        (entry) => entry.languageCode !== saved.languageCode,
      );
      return [...next, saved];
    });
    setAssetMessage("이력서 정보를 저장했습니다.");
  }

  async function uploadMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file || !mediaForm.altKo.trim()) {
      setAssetMessage("파일과 국문 대체 텍스트를 입력해주세요.");
      return;
    }

    const payload = new FormData();
    payload.append("file", file);
    payload.append("altKo", mediaForm.altKo);
    payload.append("altEn", mediaForm.altEn);
    payload.append("captionKo", mediaForm.captionKo);
    payload.append("captionEn", mediaForm.captionEn);

    setUploading(true);
    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: payload,
    });
    setUploading(false);

    if (!response.ok) {
      setAssetMessage("미디어 업로드에 실패했습니다.");
      return;
    }

    const saved = (await response.json()) as MediaAssetResponse;
    setMedia((current) => [saved, ...current]);
    setMediaForm({
      altKo: "",
      altEn: "",
      captionKo: "",
      captionEn: "",
    });
    form.reset();
    setAssetMessage("미디어를 업로드했습니다.");
  }

  return (
    <div className="grid gap-6">
      <Card
        title="Site Settings"
        description="히어로 카피와 연락처는 공개 사이트의 첫 인상을 결정합니다."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              label: "Hero Title (KO)",
              value: settings.heroTitle.ko,
              onChange: (value: string) =>
                setSettings((current) => ({
                  ...current,
                  heroTitle: { ...current.heroTitle, ko: value },
                })),
            },
            {
              label: "Hero Title (EN)",
              value: settings.heroTitle.en ?? "",
              onChange: (value: string) =>
                setSettings((current) => ({
                  ...current,
                  heroTitle: { ...current.heroTitle, en: value },
                })),
            },
            {
              label: "Hero Subtitle (KO)",
              value: settings.heroSubtitle.ko,
              onChange: (value: string) =>
                setSettings((current) => ({
                  ...current,
                  heroSubtitle: { ...current.heroSubtitle, ko: value },
                })),
            },
            {
              label: "Hero Subtitle (EN)",
              value: settings.heroSubtitle.en ?? "",
              onChange: (value: string) =>
                setSettings((current) => ({
                  ...current,
                  heroSubtitle: { ...current.heroSubtitle, en: value },
                })),
            },
          ].map((field) => (
            <label key={field.label} className="grid gap-2 text-sm text-white/72">
              <span>{field.label}</span>
              <input
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
              />
            </label>
          ))}

          <label className="grid gap-2 text-sm text-white/72 md:col-span-2">
            <span>Hero Description (KO)</span>
            <textarea
              rows={3}
              value={settings.heroDescription.ko}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  heroDescription: {
                    ...current.heroDescription,
                    ko: event.target.value,
                  },
                }))
              }
              className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </label>
          <label className="grid gap-2 text-sm text-white/72 md:col-span-2">
            <span>Hero Description (EN)</span>
            <textarea
              rows={3}
              value={settings.heroDescription.en ?? ""}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  heroDescription: {
                    ...current.heroDescription,
                    en: event.target.value,
                  },
                }))
              }
              className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            {
              label: "Contact Email",
              value: settings.contactEmail,
              onChange: (value: string) => updateContactField("contactEmail", value),
            },
            {
              label: "Contact Phone",
              value: settings.contactPhone ?? "",
              onChange: (value: string) => updateContactField("contactPhone", value),
            },
            {
              label: "GitHub URL",
              value: settings.githubUrl ?? "",
              onChange: (value: string) => updateContactField("githubUrl", value),
            },
            {
              label: "LinkedIn URL",
              value: settings.linkedInUrl ?? "",
              onChange: (value: string) => updateContactField("linkedInUrl", value),
            },
          ].map((field) => (
            <label key={field.label} className="grid gap-2 text-sm text-white/72">
              <span>{field.label}</span>
              <input
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
              />
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={saveSettings}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            사이트 설정 저장
          </button>
          {siteMessage ? <p className="text-sm text-[#8b5cf6]">{siteMessage}</p> : null}
        </div>
      </Card>

      <Card
        title="Achievements & Resume"
        description="홈 화면의 지표 카드와 다운로드 이력서를 한 화면에서 관리합니다."
      >
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.title.ko}
                    onChange={(event) =>
                      setAchievements((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? {
                                ...entry,
                                title: { ...entry.title, ko: event.target.value },
                              }
                            : entry,
                        ),
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white"
                  />
                  <input
                    value={item.metric}
                    onChange={(event) =>
                      setAchievements((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, metric: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white"
                  />
                  <textarea
                    rows={3}
                    value={item.summary.ko}
                    onChange={(event) =>
                      setAchievements((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? {
                                ...entry,
                                summary: {
                                  ...entry.summary,
                                  ko: event.target.value,
                                },
                              }
                            : entry,
                        ),
                      )
                    }
                    className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void saveAchievement(item)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteAchievement(item.id)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/75"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setAchievements((current) => [
                  ...current,
                  {
                    id: -Date.now(),
                    title: { ko: "새 성과", en: "" },
                    summary: { ko: "", en: "" },
                    metric: "0",
                    accent: "copper",
                    status: "DRAFT",
                    sortOrder: current.length + 1,
                  },
                ])
              }
              className="rounded-full border border-dashed border-white/20 px-5 py-3 text-sm font-semibold text-white/70"
            >
              성과 추가
            </button>
          </div>

          <div className="grid gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.languageCode}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  {resume.languageCode}
                </p>
                <div className="mt-3 grid gap-3">
                  <input
                    value={resume.label}
                    onChange={(event) =>
                      setResumes((current) =>
                        current.map((entry) =>
                          entry.languageCode === resume.languageCode
                            ? { ...entry, label: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white"
                  />
                  <input
                    value={resume.fileName}
                    onChange={(event) =>
                      setResumes((current) =>
                        current.map((entry) =>
                          entry.languageCode === resume.languageCode
                            ? { ...entry, fileName: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white"
                  />
                  <input
                    value={resume.fileUrl}
                    onChange={(event) =>
                      setResumes((current) =>
                        current.map((entry) =>
                          entry.languageCode === resume.languageCode
                            ? { ...entry, fileUrl: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void saveResume(resume)}
                  className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                >
                  이력서 저장
                </button>
              </div>
            ))}
          </div>
        </div>
        {assetMessage ? <p className="mt-4 text-sm text-[#8b5cf6]">{assetMessage}</p> : null}
      </Card>

      <Card
        title="Media Library"
        description="대표 이미지와 다이어그램 자산을 업로드하고 프로젝트에 연결할 수 있습니다."
      >
        <form onSubmit={uploadMedia} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="file"
              type="file"
              className="rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-white"
            />
            <input
              value={mediaForm.altKo}
              onChange={(event) =>
                setMediaForm((current) => ({ ...current, altKo: event.target.value }))
              }
              placeholder="대체 텍스트 (KO)"
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white"
            />
            <input
              value={mediaForm.altEn}
              onChange={(event) =>
                setMediaForm((current) => ({ ...current, altEn: event.target.value }))
              }
              placeholder="Alt text (EN)"
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white"
            />
            <input
              value={mediaForm.captionKo}
              onChange={(event) =>
                setMediaForm((current) => ({
                  ...current,
                  captionKo: event.target.value,
                }))
              }
              placeholder="캡션 (KO)"
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-fit rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            {uploading ? "업로드 중..." : "미디어 업로드"}
          </button>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <a
              key={item.id}
              href={item.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 transition hover:bg-black/30"
            >
              <p className="truncate text-sm font-semibold text-white">
                {item.originalFileName}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/40">
                {item.contentType}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {item.altKo || "-"}
              </p>
            </a>
          ))}
        </div>
      </Card>

      <Card
        title="Contact Inbox"
        description="공개 문의는 데이터베이스에 저장되고, 이 화면에서 바로 확인할 수 있습니다."
      >
        <div className="grid gap-4">
          {messages.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm text-white/55">
              아직 수신된 문의가 없습니다.
            </div>
          ) : null}
          {messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "rounded-[1.5rem] border border-white/10 bg-black/20 p-5",
                message.status === "NEW" && "border-[#8b5cf6]/40",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {message.name} · {message.email}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">
                    {message.company || "Independent"} · {message.status}
                  </p>
                </div>
                <p className="text-sm text-white/45">
                  {message.createdAt.replace("T", " ").slice(0, 16)}
                </p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/66">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
