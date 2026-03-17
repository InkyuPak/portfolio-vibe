import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { ProjectBlockRenderer } from "@/components/site/project-block-renderer";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SkillGrid } from "@/components/site/skill-grid";
import {
  getAwards,
  getEducation,
  getExperience,
  getProject,
  getProjects,
  getSiteOverview,
  getSkills,
} from "@/lib/api/server";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import type { PublicAwardResponse, PublicEducationResponse } from "@/lib/api/types";

/* ── i18n copy ─────────────────────────────────────────────── */
const copy = {
  ko: {
    heroEyebrow: "Java Backend Engineer · AI Infra · Drone Systems · MSA",
    heroPrimary: "프로젝트 보기",
    heroSecondary: "연락하기",
    heroDesc1: "시너지에이아이(주)에서 AI 병원 연동 백엔드를 메인 담당으로 개발하며",
    heroDesc2: "5개 병원, 530건의 실제 운영 데이터를 무장애(0건)로 안정 운영 중.",
    heroDesc3: "드론 관제 API, MSA 고도화, LLM 서빙까지 2년 5개월간 폭넓은 백엔드 경험.",
    statExp: "실무 경력",
    statExpSub: "2023.10 → 현재",
    statHospitals: "병원 연동",
    statHospitalsSub: "강북삼성 · 전남대 등",
    statCases: "운영 데이터 처리",
    statCasesSub: "장애 0건 달성",
    statProjects: "주요 프로젝트",
    statProjectsSub: "드론 · AI · MSA",
    bigAchieveTitle: "AI 병원 연동 시스템 — 메인 백엔드 담당",
    bigAchieveDesc: "XML 수신 → 처방 조회 → 리포트 전송까지 병원별 상이한 프로세스를 모두 반영하여 구현. K-medi 과제 강북삼성병원 · 전남대병원 현장 처리 완료. 실제 운영 환경에서 무장애 안정 운영.",
    bigAchieveStatLabel: "운영 장애",
    liveBadge: "시너지에이아이 재직중",
    projectsEyebrow: "대표 프로젝트",
    projectsTitle: "복잡한 흐름을 운영 가능한 시스템으로 바꾼 사례",
    projectsDesc: "테스트 프레임워크, EMR/XML 자동화, MSA 고도화까지 서로 다른 문제를 같은 백엔드 사고로 풀어낸 작업입니다.",
    experienceEyebrow: "경력",
    experienceTitle: "운영 안정성과 구조적 명확성을 남긴 2년 5개월",
    experienceDesc: "서비스 구현, 데이터 파이프라인, 병원 시스템 연동, AI 인프라까지 운영 가능한 형태로 마무리한 경험을 중심으로 정리했습니다.",
    skillsEyebrow: "기술 역량",
    skillsTitle: "Spring Boot 중심으로 데이터, 인프라, AI 연결까지 다룹니다.",
    skillsDesc: "핵심은 스택의 수가 아니라, 복잡한 문제를 실제 운영 가능한 형태로 바꾸는 능력입니다.",
    educationEyebrow: "학력 · 수상 · 자격",
    educationTitle: "학력과 활동 이력",
    educationDesc: "정규 학력 외에도 AI/ML 교육 과정을 이수하고 학술 논문과 공모전 수상 경험이 있습니다.",
    contactEyebrow: "연락",
    contactTitle: "좋은 백엔드 팀, 플랫폼 팀, AI 인프라 팀과 대화하고 싶습니다.",
    contactDesc: "채용 제안, 협업 문의, 프로젝트 논의 모두 환영합니다. 특히 Spring Boot 기반 백엔드와 플랫폼 성격이 강한 포지션을 선호합니다.",
    contactEmail: "이메일",
    contactGithub: "GitHub",
    viewAllProjects: "모든 프로젝트 보기",
    projectsPageEyebrow: "Project Library",
    projectsPageTitle: "케이스 스터디 모음",
    projectsPageDesc: "각 프로젝트는 문제 정의, 맡은 역할, 아키텍처 판단, 운영 결과까지 한 흐름으로 읽히도록 구성했습니다.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "경력 타임라인",
    experiencePageDesc: "실무에서 중요했던 것은 결국 운영 안정성과 구조적 명확성이었습니다.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "좋은 백엔드 팀, 플랫폼 팀과 대화하고 싶습니다.",
    contactPageDesc: "채용 제안, 협업 문의, 프로젝트 논의 모두 환영합니다.",
    backToProjects: "프로젝트 목록으로",
    problem: "Problem",
    role: "Role",
    architecture: "Architecture",
    outcome: "Outcome",
    awardTypeLabels: {
      PUBLICATION: "논문",
      COMPETITION: "수상",
      CERTIFICATION: "자격증",
      EDUCATION_COURSE: "교육",
    } as Record<string, string>,
  },
  en: {
    heroEyebrow: "Java Backend Engineer · AI Infra · Drone Systems · MSA",
    heroPrimary: "View projects",
    heroSecondary: "Contact",
    heroDesc1: "Main backend engineer for AI hospital integrations at Synergy AI,",
    heroDesc2: "processing 530+ live records across 5 hospitals with zero incidents.",
    heroDesc3: "2 years 5 months of backend experience across drones, MSA, and LLM infra.",
    statExp: "Experience",
    statExpSub: "Oct 2023 → present",
    statHospitals: "Hospitals",
    statHospitalsSub: "Integrated & stable",
    statCases: "Live cases",
    statCasesSub: "Zero incidents",
    statProjects: "Projects",
    statProjectsSub: "Drone · AI · MSA",
    bigAchieveTitle: "AI Hospital Integration Backend — Main Engineer",
    bigAchieveDesc: "Unified XML intake, prescription lookup, and report delivery across hospitals with different requirements. Handled K-medi on-site rollouts at two major hospitals. Zero incidents in production.",
    bigAchieveStatLabel: "Production incidents",
    liveBadge: "@ Synergy AI",
    projectsEyebrow: "Featured Work",
    projectsTitle: "Case studies where complexity became an operable system",
    projectsDesc: "Testing frameworks, EMR/XML automation, MSA modernization — different problems, same backend thinking.",
    experienceEyebrow: "Experience",
    experienceTitle: "2 years 5 months of operational stability and structural clarity",
    experienceDesc: "Service development, data pipelines, hospital system integration, AI infra — all delivered in an operable form.",
    skillsEyebrow: "Skills",
    skillsTitle: "Spring Boot core, extended to data, infra, and AI delivery.",
    skillsDesc: "The measure isn't stack breadth but the ability to turn complex problems into production-ready systems.",
    educationEyebrow: "Education · Awards",
    educationTitle: "Education & Recognition",
    educationDesc: "University background plus AI/ML coursework, academic paper, and competition award.",
    contactEyebrow: "Contact",
    contactTitle: "Open to great backend, platform, and AI infra teams.",
    contactDesc: "Open to roles, collaborations, and conversations. Especially interested in platform-oriented Spring Boot positions.",
    contactEmail: "Email",
    contactGithub: "GitHub",
    viewAllProjects: "View all projects",
    projectsPageEyebrow: "Project Library",
    projectsPageTitle: "Case Study Library",
    projectsPageDesc: "Each project is structured as problem → role → architecture → outcome.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "Experience Timeline",
    experiencePageDesc: "Operational stability and structural clarity were what mattered most.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "Open to great backend and platform teams.",
    contactPageDesc: "Open to roles, collaborations, and conversations.",
    backToProjects: "Back to projects",
    problem: "Problem",
    role: "Role",
    architecture: "Architecture",
    outcome: "Outcome",
    awardTypeLabels: {
      PUBLICATION: "Publication",
      COMPETITION: "Award",
      CERTIFICATION: "Certification",
      EDUCATION_COURSE: "Course",
    } as Record<string, string>,
  },
} as const;

/* ── Shared styled bits ─────────────────────────────────────── */
function StatCard({ num, label, sub }: { num: string; label: string; sub: string }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.14)",
      }}
    >
      <div
        className="font-sans text-2xl font-black leading-none"
        style={{
          background: "linear-gradient(135deg, #fff, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {num}
      </div>
      <div className="mt-1.5 text-xs font-medium" style={{ color: "rgba(249,250,251,0.55)" }}>{label}</div>
      <div className="mt-0.5 text-[11px]" style={{ color: "rgba(249,250,251,0.30)" }}>{sub}</div>
    </div>
  );
}

function EducationAwardsSection({
  education,
  awards,
  c,
}: {
  education: PublicEducationResponse[];
  awards: PublicAwardResponse[];
  c: (typeof copy)["ko"] | (typeof copy)["en"];
}) {
  return (
    <section>
      <SectionHeading eyebrow={c.educationEyebrow} title={c.educationTitle} description={c.educationDesc} />
      <div className="flex flex-col gap-4">
        {/* Education */}
        {education.map((edu) => (
          <div
            key={edu.institutionName}
            className="flex flex-col gap-1 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[3px]" style={{ color: "#8b5cf6" }}>Education</p>
              <p className="mt-1 text-base font-bold text-white">{edu.institutionName}</p>
              <p className="text-sm" style={{ color: "rgba(249,250,251,0.50)" }}>{edu.degree} · {edu.major}</p>
            </div>
            <span
              className="self-start rounded-full px-3 py-1 text-xs sm:self-center"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)", color: "rgba(249,250,251,0.45)" }}
            >
              {edu.periodLabel}
            </span>
          </div>
        ))}

        {/* Awards grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award) => (
            <div
              key={award.title}
              className="rounded-2xl p-5 transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: award.awardType === "PUBLICATION" ? "rgba(139,92,246,0.12)" :
                                award.awardType === "COMPETITION" ? "rgba(234,179,8,0.10)" :
                                "rgba(52,211,153,0.08)",
                    border: award.awardType === "PUBLICATION" ? "1px solid rgba(139,92,246,0.25)" :
                            award.awardType === "COMPETITION" ? "1px solid rgba(234,179,8,0.20)" :
                            "1px solid rgba(52,211,153,0.18)",
                    color: award.awardType === "PUBLICATION" ? "#a78bfa" :
                           award.awardType === "COMPETITION" ? "#fbbf24" :
                           "#34d399",
                  }}
                >
                  {c.awardTypeLabels[award.awardType] ?? award.awardType}
                </span>
                <span className="text-xs" style={{ color: "rgba(249,250,251,0.30)" }}>{award.periodLabel}</span>
              </div>
              <p className="text-sm font-semibold leading-snug text-white">{award.title}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(249,250,251,0.40)" }}>{award.issuer}</p>
              {award.description && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.30)" }}>{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   HomeScreen
════════════════════════════════════════════════════════════════ */
export async function HomeScreen({ locale }: { locale: Locale }) {
  const [site, projects, experience, skills, education, awards] = await Promise.all([
    getSiteOverview(locale),
    getProjects(locale, true),
    getExperience(locale),
    getSkills(locale),
    getEducation(locale),
    getAwards(locale),
  ]);

  const c = copy[locale];

  return (
    <>
      {/* ── HERO ── */}
      <section className="flex min-h-[80vh] flex-col justify-center py-12">
        {/* Live badge */}
        <div
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)", color: "#34d399" }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: "#34d399", animation: "pulse-dot 2s infinite" }}
          />
          {c.liveBadge}
        </div>

        {/* Eyebrow */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[4px]" style={{ color: "rgba(249,250,251,0.30)" }}>
          {c.heroEyebrow}
        </p>

        {/* Name */}
        <h1
          className="font-sans text-[clamp(52px,9vw,96px)] font-black leading-[0.92] tracking-[-3px]"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {locale === "ko" ? "박인규" : "Park Inkyu"}
        </h1>
        <h2
          className="mt-3 font-sans text-[clamp(18px,3vw,32px)] font-light tracking-[-0.5px]"
          style={{ color: "rgba(249,250,251,0.45)" }}
        >
          {locale === "ko" ? "Java 백엔드 개발자" : "Java Backend Engineer"}
        </h2>

        {/* Description */}
        <p className="mt-5 max-w-lg text-sm leading-[1.8]" style={{ color: "rgba(249,250,251,0.50)" }}>
          {c.heroDesc1}<br />
          <strong style={{ color: "#e5e7eb", fontWeight: 500 }}>{c.heroDesc2}</strong><br />
          {c.heroDesc3}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localizePath("/projects", locale)}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 30px rgba(124,58,237,0.30)",
            }}
          >
            {c.heroPrimary} →
          </Link>
          <Link
            href={localizePath("/contact", locale)}
            className="rounded-xl px-6 py-3 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(249,250,251,0.70)",
            }}
          >
            {c.heroSecondary}
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard num="2년 5개월" label={c.statExp} sub={c.statExpSub} />
          <StatCard num="5개" label={c.statHospitals} sub={c.statHospitalsSub} />
          <StatCard num="530건+" label={c.statCases} sub={c.statCasesSub} />
          <StatCard num="8+" label={c.statProjects} sub={c.statProjectsSub} />
        </div>

        {/* Big achievement banner */}
        <div
          className="mt-5 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(79,70,229,0.04) 100%)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <div className="text-3xl">🏥</div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{c.bigAchieveTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.50)" }}>
              {c.bigAchieveDesc}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div
              className="font-sans text-3xl font-black"
              style={{
                background: "linear-gradient(135deg, #fff, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              0건
            </div>
            <div className="text-[11px]" style={{ color: "rgba(249,250,251,0.30)" }}>{c.bigAchieveStatLabel}</div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section>
        <SectionHeading eyebrow={c.projectsEyebrow} title={c.projectsTitle} description={c.projectsDesc} />
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
        </div>
        <div className="mt-6 text-center">
          <Link
            href={localizePath("/projects", locale)}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.20)",
              color: "#a78bfa",
            }}
          >
            {c.viewAllProjects} →
          </Link>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section>
        <SectionHeading eyebrow={c.experienceEyebrow} title={c.experienceTitle} description={c.experienceDesc} />
        <ExperienceTimeline items={experience} />
      </section>

      {/* ── SKILLS ── */}
      <section>
        <SectionHeading eyebrow={c.skillsEyebrow} title={c.skillsTitle} description={c.skillsDesc} />
        <SkillGrid groups={skills} />
      </section>

      {/* ── EDUCATION & AWARDS ── */}
      <EducationAwardsSection education={education} awards={awards} c={c} />

      {/* ── CONTACT ── */}
      <section>
        <SectionHeading eyebrow={c.contactEyebrow} title={c.contactTitle} description={c.contactDesc} />
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${site.site.contactEmail}`}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              <span style={{ color: "#8b5cf6" }}>✉</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactEmail}</p>
                <p className="text-sm text-white">{site.site.contactEmail}</p>
              </div>
            </a>
            {site.site.githubUrl && (
              <a
                href={site.site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
              >
                <span style={{ color: "#8b5cf6" }}>⌥</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactGithub}</p>
                  <p className="text-sm text-white">github.com/pak-inkyu</p>
                </div>
              </a>
            )}
          </div>
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ProjectsScreen
════════════════════════════════════════════════════════════════ */
export async function ProjectsScreen({ locale }: { locale: Locale }) {
  const projects = await getProjects(locale, false);
  const c = copy[locale];

  return (
    <section>
      <SectionHeading eyebrow={c.projectsPageEyebrow} title={c.projectsPageTitle} description={c.projectsPageDesc} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ProjectDetailScreen
════════════════════════════════════════════════════════════════ */
export async function ProjectDetailScreen({ locale, slug }: { locale: Locale; slug: string }) {
  const project = await getProject(locale, slug);
  const c = copy[locale];
  const accent = project.themeColor ?? "#8b5cf6";

  return (
    <article className="flex flex-col gap-10">
      {/* Back link */}
      <Link
        href={localizePath("/projects", locale)}
        className="flex w-fit items-center gap-2 text-sm transition-colors hover:-translate-x-1"
        style={{ color: "rgba(249,250,251,0.40)" }}
      >
        ← {c.backToProjects}
      </Link>

      {/* Hero block */}
      <div
        className="overflow-hidden rounded-3xl"
        style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.14)" }}
      >
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[4px]" style={{ color: accent }}>
              Case Study
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">{project.title}</h1>
            <p className="text-sm" style={{ color: "rgba(249,250,251,0.50)" }}>{project.subtitle}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.40)" }}>{project.overview}</p>
          </div>
          {project.coverImageUrl && (
            <div className="aspect-video overflow-hidden lg:aspect-auto">
              <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* 2x2 meta grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: c.problem, content: project.problem },
          { label: c.role, content: project.role },
          { label: c.architecture, content: project.architecture },
          { label: c.outcome, content: project.outcome },
        ].map(({ label, content }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[3px]" style={{ color: accent }}>{label}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.60)" }}>{content}</p>
          </div>
        ))}
      </div>

      {/* Dynamic sections */}
      {project.sections.map((section) => (
        <ProjectBlockRenderer key={section.sortOrder} section={section} />
      ))}
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════
   ExperienceScreen
════════════════════════════════════════════════════════════════ */
export async function ExperienceScreen({ locale }: { locale: Locale }) {
  const [experience, skills] = await Promise.all([getExperience(locale), getSkills(locale)]);
  const c = copy[locale];

  return (
    <>
      <section>
        <SectionHeading eyebrow={c.experiencePageEyebrow} title={c.experiencePageTitle} description={c.experiencePageDesc} />
        <ExperienceTimeline items={experience} />
      </section>
      <section>
        <SectionHeading eyebrow={c.skillsEyebrow} title={c.skillsTitle} description={c.skillsDesc} />
        <SkillGrid groups={skills} />
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ContactScreen
════════════════════════════════════════════════════════════════ */
export async function ContactScreen({ locale }: { locale: Locale }) {
  const site = await getSiteOverview(locale);
  const c = copy[locale];

  return (
    <section>
      <SectionHeading eyebrow={c.contactPageEyebrow} title={c.contactPageTitle} description={c.contactPageDesc} />
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <a
            href={`mailto:${site.site.contactEmail}`}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
          >
            <span style={{ color: "#8b5cf6" }}>✉</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactEmail}</p>
              <p className="text-sm text-white">{site.site.contactEmail}</p>
            </div>
          </a>
          {site.site.githubUrl && (
            <a
              href={site.site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)" }}
            >
              <span style={{ color: "#8b5cf6" }}>⌥</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactGithub}</p>
                <p className="text-sm text-white">github.com/pak-inkyu</p>
              </div>
            </a>
          )}
        </div>
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}
