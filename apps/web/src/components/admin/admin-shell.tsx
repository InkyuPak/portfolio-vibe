"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const adminCopy = {
  ko: {
    label: "관리자 CMS",
    dashboard: "대시보드",
    projects: "프로젝트",
    experience: "경력",
    skills: "기술 스택",
    chrome: "Spring Boot 백엔드를 위한 편집 클라이언트",
    logout: "로그아웃",
    site: "공개 사이트",
  },
  en: {
    label: "Admin CMS",
    dashboard: "Dashboard",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    chrome: "An editorial CMS client for the Spring Boot backend",
    logout: "Logout",
    site: "Public Site",
  },
} as const;

interface AdminShellProps {
  children: ReactNode;
  displayName: string;
}

export function AdminShell({
  children,
  displayName,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = "ko";
  const copy = adminCopy[locale];

  const navItems = [
    { href: "/admin", label: copy.dashboard },
    { href: "/admin/projects", label: copy.projects },
    { href: "/admin/experience", label: copy.experience },
    { href: "/admin/skills", label: copy.skills },
  ];

  async function logout() {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
    });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0d1218] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.15),_transparent_28%),radial-gradient(circle_at_70%_10%,_rgba(79,70,229,0.12),_transparent_24%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="glass-panel self-start rounded-[2rem] border border-white/10 bg-white/5 p-5 lg:sticky lg:top-4">
          <div className="border-b border-white/10 pb-5">
            <Link
              href={localizePath("/", locale)}
              className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b5cf6]"
            >
              {copy.label}
            </Link>
            <h1 className="mt-4 font-sans text-2xl font-bold leading-tight text-white">
              {displayName}
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/60">{copy.chrome}</p>
          </div>

          <nav className="mt-5 grid gap-2">
            {navItems.map((item) => {
              const href = localizePath(item.href, locale);
              const active = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "rounded-[1.25rem] px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#8b5cf6]/15 text-[#8b5cf6] font-semibold"
                      : "bg-white/[0.03] text-white/65 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Architecture
            </p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Modular monolith, package-by-domain, concrete services, external
              ports, and architecture tests with Spring Modulith + ArchUnit.
            </p>
          </div>

          <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
            <Link
              href={localizePath("/", locale)}
              className="rounded-full border border-white/10 px-4 py-2 text-center text-sm font-semibold text-white/78 transition hover:bg-white/10"
            >
              {copy.site}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              {copy.logout}
            </button>
          </div>
        </aside>

        <main className="flex flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}
