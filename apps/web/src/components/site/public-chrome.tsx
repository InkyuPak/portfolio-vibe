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

            <a
              href="https://github.com/InkyuPak/portfolio-vibe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors"
              style={{ color: "rgba(249,250,251,0.35)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(249,250,251,0.35)")}
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
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
            <a
              href="https://github.com/InkyuPak/portfolio-vibe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: "rgba(249,250,251,0.35)" }}
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
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
            <a
              href="https://github.com/InkyuPak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 프로필"
              className="hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/inkyu-pak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
