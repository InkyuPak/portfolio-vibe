"use client";

import { useState, useTransition } from "react";

import type { Locale } from "@/lib/i18n";
import type {
  AdminProfileRecord,
  ProfileMutationInput,
} from "@/lib/portfolio/contracts";
import {
  flattenLocalizedEntries,
  pairLocalizedEntries,
} from "@/lib/portfolio/editor-utils";

interface ProfileEditorProps {
  initialProfile: AdminProfileRecord;
  locale: Locale;
}

interface EditableProfile {
  fullName: string;
  koreanName: string;
  titleKo: string;
  titleEn: string;
  straplineKo: string;
  straplineEn: string;
  introKo: string;
  introEn: string;
  locationKo: string;
  locationEn: string;
  availabilityKo: string;
  availabilityEn: string;
  biographyKo: string;
  biographyEn: string;
  specialtiesKo: string;
  specialtiesEn: string;
}

const copy = {
  ko: {
    save: "프로필 저장",
    saving: "저장 중...",
    fullName: "영문 이름",
    koreanName: "한글 이름",
    titleKo: "히어로 제목 (KO)",
    titleEn: "Hero title (EN)",
    straplineKo: "부제 (KO)",
    straplineEn: "Strapline (EN)",
    introKo: "소개 (KO)",
    introEn: "Intro (EN)",
    locationKo: "위치 (KO)",
    locationEn: "Location (EN)",
    availabilityKo: "가능 시점 (KO)",
    availabilityEn: "Availability (EN)",
    biographyKo: "바이오 문단 (KO)",
    biographyEn: "Biography paragraphs (EN)",
    specialtiesKo: "전문 영역 (KO)",
    specialtiesEn: "Specialties (EN)",
    linesHint: "한 줄에 하나씩 입력",
    saved: "프로필이 저장되었습니다.",
    failed: "프로필 저장에 실패했습니다.",
    preview: "라이브 프리뷰",
  },
  en: {
    save: "Save profile",
    saving: "Saving...",
    fullName: "Full name",
    koreanName: "Korean name",
    titleKo: "Hero title (KO)",
    titleEn: "Hero title (EN)",
    straplineKo: "Strapline (KO)",
    straplineEn: "Strapline (EN)",
    introKo: "Intro (KO)",
    introEn: "Intro (EN)",
    locationKo: "Location (KO)",
    locationEn: "Location (EN)",
    availabilityKo: "Availability (KO)",
    availabilityEn: "Availability (EN)",
    biographyKo: "Biography paragraphs (KO)",
    biographyEn: "Biography paragraphs (EN)",
    specialtiesKo: "Specialties (KO)",
    specialtiesEn: "Specialties (EN)",
    linesHint: "One item per line",
    saved: "Profile changes saved.",
    failed: "Failed to save profile changes.",
    preview: "Live preview",
  },
} as const;

function toEditableProfile(profile: AdminProfileRecord): EditableProfile {
  const biography = flattenLocalizedEntries(profile.biography);
  const specialties = flattenLocalizedEntries(profile.specialties);

  return {
    fullName: profile.fullName,
    koreanName: profile.koreanName,
    titleKo: profile.title.ko,
    titleEn: profile.title.en,
    straplineKo: profile.strapline.ko,
    straplineEn: profile.strapline.en,
    introKo: profile.intro.ko,
    introEn: profile.intro.en,
    locationKo: profile.location.ko,
    locationEn: profile.location.en,
    availabilityKo: profile.availability.ko,
    availabilityEn: profile.availability.en,
    biographyKo: biography.ko,
    biographyEn: biography.en,
    specialtiesKo: specialties.ko,
    specialtiesEn: specialties.en,
  };
}

function toProfilePayload(draft: EditableProfile): ProfileMutationInput {
  return {
    fullName: draft.fullName,
    koreanName: draft.koreanName,
    title: {
      ko: draft.titleKo,
      en: draft.titleEn,
    },
    strapline: {
      ko: draft.straplineKo,
      en: draft.straplineEn,
    },
    intro: {
      ko: draft.introKo,
      en: draft.introEn,
    },
    location: {
      ko: draft.locationKo,
      en: draft.locationEn,
    },
    availability: {
      ko: draft.availabilityKo,
      en: draft.availabilityEn,
    },
    biography: pairLocalizedEntries(draft.biographyKo, draft.biographyEn),
    specialties: pairLocalizedEntries(draft.specialtiesKo, draft.specialtiesEn),
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

export function ProfileEditor({
  initialProfile,
  locale,
}: ProfileEditorProps) {
  const labels = copy[locale];
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(toEditableProfile(initialProfile));
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function saveProfile() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toProfilePayload(draft)),
        });

        if (!response.ok) {
          throw new Error("Failed to save profile");
        }

        const updated = (await response.json()) as AdminProfileRecord;
        setProfile(updated);
        setDraft(toEditableProfile(updated));
        setMessage(labels.saved);
      } catch {
        setMessage(labels.failed);
      }
    });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
              {labels.preview}
            </p>
            <h2 className="mt-4 font-sans text-4xl text-white">
              {locale === "ko" ? draft.titleKo : draft.titleEn}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">
              {locale === "ko" ? draft.straplineKo : draft.straplineEn}
            </p>
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={isPending}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
          >
            {isPending ? labels.saving : labels.save}
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-[#8b5cf6]">{message}</p> : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label={labels.fullName}>
            <input
              value={draft.fullName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, fullName: event.target.value }))
              }
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.koreanName}>
            <input
              value={draft.koreanName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, koreanName: event.target.value }))
              }
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.titleKo}>
            <textarea
              value={draft.titleKo}
              onChange={(event) =>
                setDraft((current) => ({ ...current, titleKo: event.target.value }))
              }
              rows={3}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.titleEn}>
            <textarea
              value={draft.titleEn}
              onChange={(event) =>
                setDraft((current) => ({ ...current, titleEn: event.target.value }))
              }
              rows={3}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.straplineKo}>
            <textarea
              value={draft.straplineKo}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  straplineKo: event.target.value,
                }))
              }
              rows={4}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.straplineEn}>
            <textarea
              value={draft.straplineEn}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  straplineEn: event.target.value,
                }))
              }
              rows={4}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.introKo}>
            <textarea
              value={draft.introKo}
              onChange={(event) =>
                setDraft((current) => ({ ...current, introKo: event.target.value }))
              }
              rows={5}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.introEn}>
            <textarea
              value={draft.introEn}
              onChange={(event) =>
                setDraft((current) => ({ ...current, introEn: event.target.value }))
              }
              rows={5}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.locationKo}>
            <input
              value={draft.locationKo}
              onChange={(event) =>
                setDraft((current) => ({ ...current, locationKo: event.target.value }))
              }
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.locationEn}>
            <input
              value={draft.locationEn}
              onChange={(event) =>
                setDraft((current) => ({ ...current, locationEn: event.target.value }))
              }
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.availabilityKo}>
            <input
              value={draft.availabilityKo}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  availabilityKo: event.target.value,
                }))
              }
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.availabilityEn}>
            <input
              value={draft.availabilityEn}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  availabilityEn: event.target.value,
                }))
              }
              className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.biographyKo} hint={labels.linesHint}>
            <textarea
              value={draft.biographyKo}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  biographyKo: event.target.value,
                }))
              }
              rows={7}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.biographyEn} hint={labels.linesHint}>
            <textarea
              value={draft.biographyEn}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  biographyEn: event.target.value,
                }))
              }
              rows={7}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>

          <Field label={labels.specialtiesKo} hint={labels.linesHint}>
            <textarea
              value={draft.specialtiesKo}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  specialtiesKo: event.target.value,
                }))
              }
              rows={6}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
          <Field label={labels.specialtiesEn} hint={labels.linesHint}>
            <textarea
              value={draft.specialtiesEn}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  specialtiesEn: event.target.value,
                }))
              }
              rows={6}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[#8b5cf6]"
            />
          </Field>
        </div>
      </section>

      <aside className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
          {labels.preview}
        </p>
        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/25 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-white/40">
            {profile.version}
          </p>
          <h3 className="mt-4 font-sans text-4xl leading-tight text-white">
            {locale === "ko" ? draft.titleKo : draft.titleEn}
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/62">
            {locale === "ko" ? draft.straplineKo : draft.straplineEn}
          </p>
          <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 text-sm text-white/62">
            <p>{locale === "ko" ? draft.locationKo : draft.locationEn}</p>
            <p>{locale === "ko" ? draft.availabilityKo : draft.availabilityEn}</p>
            <p>{locale === "ko" ? draft.introKo : draft.introEn}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
