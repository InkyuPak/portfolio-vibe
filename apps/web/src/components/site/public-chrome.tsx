"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LocaleToggle } from "@/components/locale-toggle";
import { detectLocaleFromPathname, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const shellCopy = {
  ko: {
    tagline: "Spring Boot · Kafka · Docker · AI Infra",
    home: "소개",
    work: "프로젝트",
    experience: "경력",
    faq: "FAQ",
    contact: "연락",
    liveBadge: "시너지에이아이 재직중",
    footer: "백엔드 시스템, 테스트 프레임워크, 데이터 자동화, AI 확장 가능성을 함께 설계하는 포트폴리오.",
  },
  en: {
    tagline: "Spring Boot · Kafka · Docker · AI Infra",
    home: "About",
    work: "Projects",
    experience: "Experience",
    faq: "FAQ",
    contact: "Contact",
    liveBadge: "@ Synergy AI",
    footer: "A portfolio focused on backend systems, testing frameworks, data automation, and applied AI delivery.",
  },
} as const;

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = detectLocaleFromPathname(pathname);
  const copy = shellCopy[locale];

  const navItems = [
    { href: "/", label: copy.home },
    { href: "/projects", label: copy.work },
    { href: "/experience", label: copy.experience },
    { href: "/faq", label: copy.faq },
    { href: "/contact", label: copy.contact },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 600, height: 600,
          background: "rgba(139,92,246,0.13)",
          top: -150, right: -150,
          filter: "blur(120px)",
          animation: "float-blob 10s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none fixed rounded-full"
        style={{
          width: 400, height: 400,
          background: "rgba(79,70,229,0.09)",
          bottom: 100, left: -100,
          filter: "blur(120px)",
          animation: "float-blob 10s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />

      {/* Nav */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(5,5,15,0.72)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139,92,246,0.10)",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-0 sm:px-8 lg:px-10" style={{ height: 60 }}>
          {/* Logo */}
          <Link href={localizePath("/", locale)} className="flex items-center gap-2">
            <span className="font-sans text-base font-bold tracking-tight text-white">
              pak<span style={{ color: "#8b5cf6" }}>.</span>dev
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-3 lg:flex">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const href = localizePath(item.href, locale);
                const active =
                  pathname === href ||
                  (href !== localizePath("/", locale) && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-white"
                        : "text-white/40 hover:text-white/70",
                    )}
                    style={active ? { color: "#a78bfa" } : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Live badge */}
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: "rgba(52,211,153,0.10)",
                border: "1px solid rgba(52,211,153,0.22)",
                color: "#34d399",
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 6, height: 6,
                  background: "#34d399",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              {copy.liveBadge}
            </div>

            <LocaleToggle tone="dark" />
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 lg:hidden">
            <nav className="flex gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const href = localizePath(item.href, locale);
                const active =
                  pathname === href ||
                  (href !== localizePath("/", locale) && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      active ? "text-white" : "text-white/40",
                    )}
                    style={active ? { color: "#a78bfa" } : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <LocaleToggle tone="dark" />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-24 pt-10 sm:px-8 lg:px-10">
        {children}
      </main>

      <footer style={{ borderTop: "1px solid rgba(139,92,246,0.10)", background: "rgba(139,92,246,0.02)" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="font-sans text-base font-bold text-white">
              pak<span style={{ color: "#8b5cf6" }}>.</span>dev
            </p>
            <p className="mt-1 max-w-xl text-sm leading-6" style={{ color: "rgba(249,250,251,0.35)" }}>
              {copy.footer}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm" style={{ color: "rgba(249,250,251,0.30)" }}>
            <a href="mailto:zzz563214@gmail.com" className="hover:text-white transition-colors">
              zzz563214@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
