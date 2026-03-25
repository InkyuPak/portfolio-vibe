import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { HeroIllustration } from "@/components/site/hero-illustration";
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
    heroDesc1: "'작동하는 코드'보다 '운영에서 멈추지 않는 코드'를 우선합니다.",
    heroDesc2: "병원 연동, MSA, AI 인프라까지 실제 운영 가능한 형태로 구현해왔습니다.",
    heroDesc3: "팀 내외 협업을 고려한 코드와 구조를 목표로 합니다.",
    statExp: "실무 경력",
    statExpSub: "2023.10 → 현재",
    statHospitals: "실 운영 시스템",
    statHospitalsSub: "의료기관 연동 완료",
    statCases: "월 처방 데이터 처리",
    statCasesSub: "에러율 0% 유지",
    statProjects: "주요 프로젝트",
    statProjectsSub: "드론 · AI · MSA",
    bigAchieveTitle: "월 40,000건+ 처방 처리 — 에러율 0%",
    bigAchieveDesc: "실제 환자 데이터가 오가는 폐쇄망 의료 시스템에서 8개월간 무중단 운영. 누적 170K+ 처리, 단 한 건의 장애도 없었습니다.",
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
    projectsPageTitle: "프로젝트 모음",
    projectsPageDesc: "각 프로젝트는 문제 정의, 맡은 역할, 아키텍처 판단, 운영 결과까지 한 흐름으로 읽히도록 구성했습니다.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "경력 타임라인",
    experiencePageDesc: "실무에서 중요했던 것은 결국 운영 안정성과 구조적 명확성이었습니다.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "좋은 백엔드 팀, 플랫폼 팀과 대화하고 싶습니다.",
    contactPageDesc: "채용 제안, 협업 문의, 프로젝트 논의 모두 환영합니다.",
    faqEyebrow: "FAQ",
    faqTitle: "코드 밖의 저를 소개합니다",
    faqDesc: "포트폴리오만으로는 전달하기 어려운 이야기들을 정리했습니다.",
    faqItems: [
      {
        q: "개발자가 된 계기가 뭔가요?",
        a: "대학 졸업작품으로 자동화 로봇을 만들었고, 제 역할은 제어 파트였습니다. 3D 스캐너로 흉상을 만드는 아이디어가 큰 호응을 받아 2019년 CES에 출전하게 됐고, 전시 도중 애플 직원이 부스에 찾아와 4명에게 면접을 제안했습니다. 언어 장벽으로 합격은 못 했지만, 기술이 사람의 마음을 움직이는 순간을 그때 처음 느꼈습니다. 그 경험이 결국 저를 개발자로 이끌었습니다.",
      },
      {
        q: "지금까지 가장 자랑스러운 성과는 무엇인가요?",
        a: "시너지에이아이에서 AI 병원 연동 백엔드를 메인으로 맡아, XML 수신부터 처방 조회, 리포트 전송까지 병원마다 다른 요구사항을 하나의 시스템으로 구현한 것입니다. K-medi 과제로 강북삼성병원·전남대병원 등 5개 병원, 530건 이상의 실운영 데이터를 장애 0건으로 안정 운영 중입니다. 숫자보다 더 의미 있는 건, 실제 환자 데이터가 오가는 시스템을 단 한 번도 멈추지 않았다는 사실입니다.",
      },
      {
        q: "어떻게 공부하나요?",
        a: "직무 전환을 위해 코딩 학원에 다닐 때, 학원에 제일 일찍 오고 제일 늦게 가서 '학원 지박령'이라는 별명을 얻었습니다. 지금도 퇴근 후 집에서 유료 강의를 듣고 개인 스터디를 이어가고 있습니다. 특히 주변 개발자 친구들과 사이드 프로젝트를 함께 진행하면서, 실무에서 쉽게 시도하기 어려운 기술들을 직접 실험해보고 있습니다. 어려운 길일수록 내가 더 강해진다는 생각으로, 배움을 멈추지 않는 것이 제가 지켜온 가장 오래된 습관입니다.",
      },
      {
        q: "코딩 강사를 했다고요?",
        a: "20대 후반, 친구의 추천으로 코딩 학원에서 약 1년간 강사로 근무했습니다. 초·중·고 학생 15명 이상을 대상으로 C/C++, 자료구조·알고리즘을 가르쳤고, 프로그래머스·백준 문제를 직접 난이도별로 풀어 강의 자료를 만들었습니다. 학생들의 반응이 좋아 시급 인상과 추가 강의 개설로 이어졌고, 퇴사할 때 학부모들께 감사 인사를 받았습니다. 이 경험이 복잡한 개념을 명확하게 설명하는 능력의 바탕이 됐다고 생각합니다.",
      },
      {
        q: "팀에서 어떤 역할을 하나요?",
        a: "학원 시절, 강사와 동료들의 추천으로 팀 프로젝트 팀장을 맡았습니다. 그 경험으로 협업과 소통이 결과물의 질을 결정한다는 걸 배웠습니다. 현재 회사에서도 같은 방식으로 팀에 기여하고 있고, 2025년 사내 성과 평가에서 대상을 받았습니다. 조용히 혼자 잘하는 것보다, 팀 전체가 더 잘할 수 있도록 돕는 역할을 좋아합니다.",
      },
      {
        q: "가장 어려웠던 기술적 문제는 무엇이었나요?",
        a: "병원마다 EMR 시스템이 다르고 XML 포맷도 제각각인 상황에서, 각 병원의 플로우를 하나의 코드베이스로 처리하면서도 유지보수 가능하게 설계하는 것이 가장 까다로웠습니다. 처음에는 조건 분기가 계속 쌓였고, 운영 도중 예상치 못한 엣지케이스가 나왔습니다. 반복적으로 코드를 다듬고 테스트를 보강하면서 지금의 구조로 안정화했습니다. 그 과정이 저에게 '작동하는 코드'와 '운영 가능한 코드'의 차이를 몸으로 가르쳐줬습니다.",
      },
      {
        q: "앞으로 어떤 개발자가 되고 싶나요?",
        a: "복잡한 문제를 실제로 운영 가능한 형태로 풀어내는 개발자가 되고 싶습니다. 코드를 잘 짜는 것도 중요하지만, 그보다 시스템이 현실 세계에서 안정적으로 작동하고, 팀이 그 코드를 믿고 이어갈 수 있는 것이 더 중요하다고 생각합니다. AI와 인프라가 빠르게 변하는 지금, 그 변화를 이해하면서도 중심을 잃지 않는 백엔드 엔지니어가 되는 것이 목표입니다.",
      },
    ] as { q: string; a: string }[],
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
      TEACHING: "강의",
    } as Record<string, string>,
  },
  en: {
    heroEyebrow: "Java Backend Engineer · AI Infra · Drone Systems · MSA",
    heroPrimary: "View projects",
    heroSecondary: "Contact",
    heroDesc1: "I care more about code that never goes down in production than code that merely works.",
    heroDesc2: "Hospital integrations, MSA migration, AI infra — delivering across domains in production-ready form.",
    heroDesc3: "My goal is code and structure that any team — including cross-functional partners — can understand and build on.",
    statExp: "Experience",
    statExpSub: "Oct 2023 → present",
    statHospitals: "Live systems",
    statHospitalsSub: "Medical integrations",
    statCases: "Prescriptions / month",
    statCasesSub: "Zero error rate",
    statProjects: "Projects",
    statProjectsSub: "Drone · AI · MSA",
    bigAchieveTitle: "40,000+ prescriptions/month — Zero error rate",
    bigAchieveDesc: "8 months of uninterrupted operation on a closed-network medical system carrying real patient data. 170K+ cumulative records processed. Not a single incident.",
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
    projectsPageTitle: "Project Collection",
    projectsPageDesc: "Each project is structured as problem → role → architecture → outcome.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "Experience Timeline",
    experiencePageDesc: "Operational stability and structural clarity were what mattered most.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "Open to great backend and platform teams.",
    contactPageDesc: "Open to roles, collaborations, and conversations.",
    faqEyebrow: "FAQ",
    faqTitle: "Beyond the code",
    faqDesc: "Things that don't fit neatly into a resume but tell you who I am.",
    faqItems: [
      {
        q: "What led you to become a developer?",
        a: "My university graduation project was an automated robot — I handled the control system. The idea of 3D-scanning people to print busts became a hit, and we made it to CES 2019. During the expo, an Apple employee walked up to our booth and proposed interviews for 4 of us. I didn't pass due to the language barrier, but that was the moment I felt technology moving people. It's what ultimately pushed me into software.",
      },
      {
        q: "What's your proudest achievement so far?",
        a: "Being the main backend engineer for the AI hospital integration at Synergy AI. I built the full pipeline — XML intake, prescription lookup, report delivery — handling each hospital's unique requirements in a single system. We're now running 530+ live records across 5 hospitals including major institutions, with zero production incidents. What matters more than the numbers is that a system handling real patient data has never gone down.",
      },
      {
        q: "How do you keep learning?",
        a: "When I was transitioning careers at a coding bootcamp, I arrived first and left last every day — my classmates jokingly called me 'the bootcamp ghost.' I still come home after late nights at work and watch paid courses or dig into personal study projects. I also work on side projects with developer friends, which gives me space to experiment with things that are harder to try in a production environment. The idea that hard paths make you stronger isn't just a motivational phrase for me — it's a habit I've kept since day one.",
      },
      {
        q: "You were a coding instructor?",
        a: "In my late twenties, a friend recommended me for a position at a coding academy, where I taught C/C++ and data structures/algorithms to 15+ elementary, middle, and high school students for about a year. I personally worked through problems on Programmers and Baekjoon to build graded lesson material. Student results were strong enough that I received a pay raise and opened additional classes. I left with thank-you messages from parents — and a much sharper ability to explain complex things clearly.",
      },
      {
        q: "What's your role in a team?",
        a: "Back in bootcamp, instructors and classmates recommended me to lead the team project. That experience taught me that how a team communicates determines the quality of what it ships. I've carried that approach into my current role, and in 2025 I received the company's top performance award. I'd rather help the whole team level up than just perform well individually.",
      },
      {
        q: "What was the hardest technical problem you've faced?",
        a: "Designing a single codebase that handled all five hospitals' EMR integrations — each with different systems and XML formats — while keeping it maintainable. Early on, conditional branches kept piling up and unexpected edge cases surfaced mid-operation. I worked through it iteratively: tightening the structure, reinforcing tests, stabilizing incrementally. That process taught me the real difference between code that works and code that can actually be operated.",
      },
      {
        q: "What kind of engineer do you want to become?",
        a: "One who turns complex problems into systems that actually run in production. Writing clean code matters, but what matters more is that the system holds up in the real world and that the team can trust and maintain what was built. With AI and infrastructure evolving fast, my goal is to stay a backend engineer who understands those shifts without losing the fundamentals.",
      },
    ] as { q: string; a: string }[],
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
      TEACHING: "Teaching",
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

        {/* Awards — teaching featured left, rest compact right */}
        {(() => {
          const teaching = awards.find((a) => a.awardType === "TEACHING");
          const rest = awards.filter((a) => a.awardType !== "TEACHING");
          return (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Featured teaching card */}
              {teaching && (
                <div
                  className="flex flex-col justify-between rounded-2xl p-6"
                  style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.20)" }}
                >
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.30)", color: "#fb923c" }}
                      >
                        {c.awardTypeLabels[teaching.awardType] ?? teaching.awardType}
                      </span>
                      <span className="text-xs" style={{ color: "rgba(249,250,251,0.35)" }}>{teaching.periodLabel}</span>
                    </div>
                    <p className="text-xl font-bold leading-snug text-white">{teaching.title}</p>
                    <p className="mt-2 text-sm" style={{ color: "rgba(249,250,251,0.50)" }}>{teaching.issuer}</p>
                    {teaching.description && (
                      <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.40)" }}>{teaching.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Rest — compact 2-col grid */}
              <div className="grid auto-rows-min gap-3 sm:grid-cols-2">
                {rest.map((award) => (
                  <div
                    key={award.title}
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
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
                      <span className="text-[10px]" style={{ color: "rgba(249,250,251,0.25)" }}>{award.periodLabel}</span>
                    </div>
                    <p className="text-xs font-semibold leading-snug text-white">{award.title}</p>
                    <p className="mt-1 text-[10px]" style={{ color: "rgba(249,250,251,0.35)" }}>{award.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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

  /* ── band style helpers ── */
  const lightBand = {
    background: "#f5f2ff",
    borderTop: "1px solid rgba(139,92,246,0.12)",
    borderBottom: "1px solid rgba(139,92,246,0.12)",
  } as const;
  const blackBand = {
    background: "#000000",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  } as const;
  const bandPad = "px-6 sm:px-8 lg:px-10";

  return (
    /* Negative margin escapes chrome's horizontal padding → full-width bands */
    <div className="-mx-6 sm:-mx-8 lg:-mx-10 flex flex-col">

      {/* ══ HERO — base dark ═══════════════════════════════════ */}
      <div className={bandPad}>
        <section className="flex min-h-[80vh] flex-col justify-center py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_420px]">
            {/* LEFT — text */}
            <div>
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
            </div>

            {/* RIGHT — illustration */}
            <div className="hidden lg:flex lg:justify-center">
              <HeroIllustration />
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard num="2년 5개월" label={c.statExp} sub={c.statExpSub} />
            <StatCard num="5개" label={c.statHospitals} sub={c.statHospitalsSub} />
            <StatCard num="40K+" label={c.statCases} sub={c.statCasesSub} />
            <StatCard num="6+" label={c.statProjects} sub={c.statProjectsSub} />
          </div>

        </section>
      </div>

      {/* ══ FEATURED PROJECTS — light band ══════════════════════ */}
      <div className={bandPad + " py-20"} style={lightBand}>
        <SectionHeading eyebrow={c.projectsEyebrow} title={c.projectsTitle} description={c.projectsDesc} light />
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} light />)}
        </div>
        <div className="mt-6 text-center">
          <Link
            href={localizePath("/projects", locale)}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(139,92,246,0.22)",
              color: "#7c3aed",
            }}
          >
            {c.viewAllProjects} →
          </Link>
        </div>
      </div>

      {/* ══ EXPERIENCE — dark ════════════════════════════════════ */}
      <div className={bandPad + " py-20"}>
        <SectionHeading eyebrow={c.experienceEyebrow} title={c.experienceTitle} description={c.experienceDesc} />
        <ExperienceTimeline items={experience} />
      </div>

      {/* ══ SKILLS — light band ══════════════════════════════════ */}
      <div className={bandPad + " py-20"} style={lightBand}>
        <SectionHeading eyebrow={c.skillsEyebrow} title={c.skillsTitle} description={c.skillsDesc} light />
        <SkillGrid groups={skills} light />
      </div>

      {/* ══ EDUCATION & AWARDS — dark ════════════════════════════ */}
      <div className={bandPad + " py-20"}>
        <EducationAwardsSection education={education} awards={awards} c={c} />
      </div>

      {/* ══ CONTACT — base dark ══════════════════════════════════ */}
      <div className={bandPad + " py-20"}>
        <SectionHeading eyebrow={c.contactEyebrow} title={c.contactTitle} description={c.contactDesc} />
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${site.site.contactEmail}`}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <span style={{ color: "#a78bfa" }}>✉</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(249,250,251,0.35)" }}>{c.contactEmail}</p>
                <p className="text-sm text-white">{site.site.contactEmail}</p>
              </div>
            </a>
          </div>
          <ContactForm locale={locale} />
        </div>
      </div>

    </div>
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

  const metaItems = [
    { label: c.problem, icon: "⚡", content: project.problem },
    { label: c.role, icon: "◈", content: project.role },
    { label: c.architecture, icon: "⬡", content: project.architecture },
    { label: c.outcome, icon: "◎", content: project.outcome },
  ];

  return (
    <article className="flex flex-col gap-16">
      {/* ── Back link ── */}
      <Link
        href={localizePath("/projects", locale)}
        className="flex w-fit items-center gap-2 text-sm font-medium transition-all duration-200 hover:-translate-x-1"
        style={{ color: "rgba(249,250,251,0.35)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polyline points="10,3 5,8 10,13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {c.backToProjects}
      </Link>

      {/* ── HERO ── */}
      <header className="relative">
        {/* Ambient glow behind title */}
        <div
          className="pointer-events-none absolute -top-16 left-0 h-64 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: accent }}
        />

        {/* Eyebrow */}
        <div className="relative mb-6 flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[4px]"
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}40`,
              color: accent,
            }}
          >
            Case Study
          </span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
        </div>

        {/* Title */}
        <h1
          className="relative font-sans text-[clamp(40px,8vw,80px)] font-black leading-[0.92] tracking-[-3px]"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {project.title}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-3 font-sans text-[clamp(16px,2.5vw,24px)] font-medium leading-snug tracking-[-0.3px]"
          style={{ color: `${accent}ee` }}
        >
          {project.subtitle}
        </p>

        {/* Overview */}
        <p
          className="mt-5 max-w-2xl text-base leading-8"
          style={{ color: "rgba(249,250,251,0.50)" }}
        >
          {project.overview}
        </p>

        {/* Cover image */}
        {project.coverImageUrl && (
          <div
            className="mt-8 overflow-hidden rounded-2xl"
            style={{ border: `1px solid ${accent}25` }}
          >
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full object-contain"
              style={{ display: "block" }}
            />
          </div>
        )}
      </header>

      {/* ── META CARDS — Problem / Role / Architecture / Outcome ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {metaItems.map(({ label, icon, content }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(5,5,15,0.60)",
              border: `1px solid ${accent}20`,
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
              style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}40)` }}
            />

            {/* Content */}
            <div className="pl-4">
              <div className="mb-3 flex items-center gap-2">
                <span style={{ color: accent, fontSize: 14 }}>{icon}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-[3px]"
                  style={{ color: accent }}
                >
                  {label}
                </span>
              </div>
              <p
                className="text-sm leading-7"
                style={{ color: "rgba(249,250,251,0.62)" }}
              >
                {content}
              </p>
            </div>

            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: `radial-gradient(ellipse at 0% 50%, ${accent}06, transparent 60%)` }}
            />
          </div>
        ))}
      </div>

      {/* ── DYNAMIC SECTIONS ── */}
      <div className="flex flex-col gap-14">
        {project.sections.map((section) => (
          <ProjectBlockRenderer key={section.sortOrder} section={section} accent={accent} />
        ))}
      </div>

      {/* ── GALLERY (hospital-integration-automation) ── */}
      {slug === "hospital-integration-automation" && (
        <section>
          {/* Section header */}
          <div className="mb-8 flex items-center gap-4">
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[4px]"
                style={{ color: accent }}
              >
                Gallery
              </p>
              <h2
                className="font-sans text-2xl font-black tracking-tight text-white"
              >
                스크린샷
              </h2>
            </div>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {["/images/macai1.png", "/images/macai2.png", "/images/macai3.png", "/images/macai4.png"].map((src, i) => (
              <div
                key={src}
                className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ border: `1px solid ${accent}25`, background: "rgba(5,5,15,0.60)" }}
              >
                <img
                  src={src}
                  alt={`MAC-AI 스크린샷 ${i + 1}`}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ display: "block" }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── GALLERY (adsync-engine) ── */}
      {slug === "adsync-engine" && (
        <section>
          <div className="mb-8 flex items-center gap-4">
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[4px]"
                style={{ color: accent }}
              >
                Gallery
              </p>
              <h2 className="font-sans text-2xl font-black tracking-tight text-white">
                데모
              </h2>
            </div>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
          </div>
          <div
            className="group overflow-hidden rounded-2xl"
            style={{ border: `1px solid ${accent}25`, background: "rgba(5,5,15,0.60)" }}
          >
            <img
              src="/images/ad.gif"
              alt="AdSync Engine 데모"
              className="w-full object-cover"
              style={{ display: "block" }}
            />
          </div>
        </section>
      )}

      {/* ── GALLERY (hospital-integration-test-framework) ── */}
      {slug === "hospital-integration-test-framework" && (
        <section>
          {/* Section header */}
          <div className="mb-8 flex items-center gap-4">
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[4px]"
                style={{ color: accent }}
              >
                Gallery
              </p>
              <h2
                className="font-sans text-2xl font-black tracking-tight text-white"
              >
                스크린샷
              </h2>
            </div>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {["/images/his1.png", "/images/his2.png", "/images/his3.png", "/images/his4.png"].map((src, i) => (
              <div
                key={src}
                className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ border: `1px solid ${accent}25`, background: "rgba(5,5,15,0.60)" }}
              >
                <img
                  src={src}
                  alt={`HIS 스크린샷 ${i + 1}`}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ display: "block" }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
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
        </div>
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FaqScreen
════════════════════════════════════════════════════════════════ */
export function FaqScreen({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <section>
      <SectionHeading eyebrow={c.faqEyebrow} title={c.faqTitle} description={c.faqDesc} />
      <div className="flex flex-col gap-5">
        {c.faqItems.map(({ q, a }, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(5,5,15,0.60)",
              border: "1px solid rgba(139,92,246,0.18)",
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
              style={{
                background: "linear-gradient(to bottom, #8b5cf6, rgba(139,92,246,0.25))",
              }}
            />

            {/* Content */}
            <div className="pl-5">
              <p
                className="mb-3 text-sm font-bold leading-snug"
                style={{ color: "#a78bfa" }}
              >
                Q. {q}
              </p>
              <p
                className="text-sm leading-[1.85]"
                style={{ color: "rgba(249,250,251,0.62)" }}
              >
                {a}
              </p>
            </div>

            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.06), transparent 60%)",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
