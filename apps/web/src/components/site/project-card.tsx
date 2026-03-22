"use client";

import Link from "next/link";
import type { PublicProjectSummaryResponse } from "@/lib/api/types";
import { localizePath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: PublicProjectSummaryResponse;
  locale: Locale;
  light?: boolean;
}

export function ProjectCard({ project, locale, light }: ProjectCardProps) {
  const accent = project.themeColor ?? "#8b5cf6";
  const href = localizePath(`/projects/${project.slug}`, locale);

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: light ? "#ffffff" : "rgba(139,92,246,0.04)",
        border: light ? "1px solid rgba(139,92,246,0.14)" : "1px solid rgba(139,92,246,0.13)",
        boxShadow: light ? "0 2px 12px rgba(139,92,246,0.07)" : `0 0 0 0 ${accent}22`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${accent}22`;
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.30)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = light ? "0 2px 12px rgba(139,92,246,0.07)" : "none";
        (e.currentTarget as HTMLElement).style.borderColor = light ? "rgba(139,92,246,0.14)" : "rgba(139,92,246,0.13)";
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Cover image */}
      {project.coverImageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: light
              ? `linear-gradient(180deg, transparent 50%, rgba(245,242,255,0.5) 100%)`
              : `linear-gradient(180deg, transparent 40%, rgba(5,5,15,0.8) 100%)` }}
          />
          {project.featured && (
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{ background: `${accent}33`, border: `1px solid ${accent}66`, color: accent }}
            >
              Featured
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-col gap-1">
          <h3
            className="text-lg font-bold leading-tight"
            style={{ color: light ? "#1e1b4b" : "#ffffff" }}
          >
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-xs font-medium tracking-wide" style={{ color: accent }}>
              {project.subtitle}
            </p>
          )}
        </div>
        <p className="line-clamp-5 text-sm leading-relaxed" style={{ color: light ? "#6b7280" : "rgba(249,250,251,0.40)" }}>
          {project.overview}
        </p>
        <div
          className="mt-auto pt-4 flex items-center gap-2 text-xs font-medium transition-colors"
          style={{ color: accent }}
        >
          케이스 스터디 열기
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
