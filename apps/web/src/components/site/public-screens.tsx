import Link from "next/link";

import { ContactForm } from "@/components/site/contact-form";
import { ExperienceTimeline } from "@/components/site/experience-timeline";
import { ProjectBlockRenderer } from "@/components/site/project-block-renderer";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SkillGrid } from "@/components/site/skill-grid";
import {
  getExperience,
  getProject,
  getProjects,
  getSiteOverview,
  getSkills,
} from "@/lib/api/server";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

const copy = {
  ko: {
    heroEyebrow: "Java Backend Engineer",
    heroPrimary: "대표 프로젝트 보기",
    heroSecondary: "국문 이력서 열기",
    metricsEyebrow: "핵심 성과",
    metricsTitle: "이직 시장에서 바로 읽히는 결과로 정리했습니다.",
    metricsDescription:
      "단순 업무 나열이 아니라 문제의 크기, 설계 판단, 운영 임팩트를 한 번에 읽을 수 있는 구조로 포트폴리오를 설계했습니다.",
    architectureEyebrow: "백엔드 설계",
    architectureTitle: "설계 의도를 설명할 수 있는 구조를 택했습니다.",
    architectureDescription:
      "면접에서 강한 백엔드는 코드만이 아니라 왜 그 구조를 선택했는지 설명할 수 있어야 합니다. 그래서 모듈 경계, 포트 추상화, 테스트 전략까지 포트폴리오에 그대로 드러나도록 만들었습니다.",
    projectsEyebrow: "대표 프로젝트",
    projectsTitle: "복잡한 흐름을 운영 가능한 시스템으로 바꾼 사례",
    projectsDescription:
      "테스트 프레임워크, EMR/XML 자동화, MSA 고도화까지 서로 다른 문제를 같은 백엔드 사고로 풀어낸 작업입니다.",
    experienceEyebrow: "경력 흐름",
    experienceTitle: "실무에서 중요했던 것은 결국 운영 안정성과 구조적 명확성이었습니다.",
    experienceDescription:
      "서비스 구현, 데이터 파이프라인, 병원 시스템 연동, 관측성 설계까지 모두 운영 가능한 형태로 마무리한 경험을 중심으로 정리했습니다.",
    skillsEyebrow: "기술 역량",
    skillsTitle: "Spring Boot 중심으로 데이터, 인프라, AI 연결까지 다룹니다.",
    skillsDescription:
      "핵심은 스택의 수가 아니라, 복잡한 문제를 실제 운영 가능한 형태로 바꾸는 능력입니다.",
    resumeEyebrow: "이력서",
    resumeTitle: "서류와 포트폴리오가 같은 메시지를 전달하도록 구성했습니다.",
    resumeDescription:
      "백엔드 설계, 테스트 전략, 데이터 자동화, AI 적용 가능성이라는 중심축이 사이트와 이력서에 일관되게 반영됩니다.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "성장보다 설계 품질을 남긴 경력을 보여줍니다.",
    experiencePageDescription:
      "문제-역할-설계-성과의 구조로 경력을 다시 편집해, 면접에서 기술적 판단을 자연스럽게 설명할 수 있도록 구성했습니다.",
    projectsPageEyebrow: "Project Library",
    projectsPageTitle: "단순 결과보다 설계 의도를 중심으로 정리한 케이스 스터디",
    projectsPageDescription:
      "각 프로젝트는 문제 정의, 맡은 역할, 아키텍처 판단, 운영 결과까지 한 흐름으로 읽히도록 구성했습니다.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "좋은 백엔드 팀, 플랫폼 팀, AI 인프라 팀과 대화하고 싶습니다.",
    contactPageDescription:
      "채용 제안, 협업 문의, 프로젝트 논의 모두 환영합니다. 특히 Spring Boot 기반 백엔드와 플랫폼 성격이 강한 포지션을 선호합니다.",
    backToProjects: "프로젝트 목록으로",
    problem: "Problem",
    role: "Role",
    architecture: "Architecture",
    outcome: "Outcome",
    adminNote: "관리자 CMS에서 이 페이지의 모든 콘텐츠를 직접 수정할 수 있습니다.",
  },
  en: {
    heroEyebrow: "Java Backend Engineer",
    heroPrimary: "View featured work",
    heroSecondary: "Open resume PDF",
    metricsEyebrow: "Selected Outcomes",
    metricsTitle: "Positioned for hiring with evidence, not just job history.",
    metricsDescription:
      "The portfolio is structured so a hiring manager can read problem scope, design judgment, and operational impact in one pass.",
    architectureEyebrow: "Backend Architecture",
    architectureTitle: "The structure is chosen to be explainable, not just workable.",
    architectureDescription:
      "Strong backend work should be defendable in interviews. The portfolio exposes module boundaries, port abstractions, and testing strategy as first-class material.",
    projectsEyebrow: "Featured Work",
    projectsTitle: "Case studies where complexity became an operable system",
    projectsDescription:
      "Testing frameworks, EMR/XML automation, and MSA modernization, all solved with the same backend discipline.",
    experienceEyebrow: "Experience",
    experienceTitle: "Operational reliability and structural clarity were the recurring themes.",
    experienceDescription:
      "The experience is edited around systems that had to become dependable in production, from service automation to hospital integrations and observability work.",
    skillsEyebrow: "Capabilities",
    skillsTitle: "Spring Boot at the core, with data, infra, and AI delivery around it.",
    skillsDescription:
      "The value is not the number of tools. It is the ability to turn complexity into something teams can actually run.",
    resumeEyebrow: "Resume",
    resumeTitle: "The site and the resume tell the same technical story.",
    resumeDescription:
      "Backend architecture, test strategy, data automation, and applied AI remain the throughline across every artifact.",
    experiencePageEyebrow: "Experience",
    experiencePageTitle: "A career shaped to show judgment, not just growth.",
    experiencePageDescription:
      "Each role is reframed through problem, responsibility, design, and outcome so the technical decisions remain visible in interviews.",
    projectsPageEyebrow: "Project Library",
    projectsPageTitle: "Case studies organized around design intent",
    projectsPageDescription:
      "Every project is built as a narrative from the problem and role to architecture decisions and measurable outcomes.",
    contactPageEyebrow: "Contact",
    contactPageTitle: "Interested in strong backend, platform, and AI-infra teams.",
    contactPageDescription:
      "Open to hiring conversations, collaboration, and project discussions, especially where Spring Boot and platform thinking matter.",
    backToProjects: "Back to all projects",
    problem: "Problem",
    role: "Role",
    architecture: "Architecture",
    outcome: "Outcome",
    adminNote: "Every section on this page is editable from the CMS.",
  },
} as const;

const architecturePrinciples = {
  ko: [
    {
      title: "모듈형 모놀리스",
      description:
        "프로젝트 규모에는 현실적이면서도 도메인 경계와 확장 포인트를 명확히 보여주는 구조를 택했습니다.",
    },
    {
      title: "도메인 패키징 + 계층 분리",
      description:
        "상위는 비즈니스 도메인으로 묶고, 내부는 controller-service-repository로 나눠 응집도와 설명 가능성을 동시에 확보했습니다.",
    },
    {
      title: "Concrete Service, External Ports",
      description:
        "의미 없는 Service/Impl 쌍은 만들지 않고, StoragePort와 MailPort처럼 실제 외부 경계에만 추상화를 두었습니다.",
    },
    {
      title: "Modulith + ArchUnit 검증",
      description:
        "구조를 말로만 주장하지 않기 위해 모듈 경계와 레이어 규칙을 테스트로 고정했습니다.",
    },
  ],
  en: [
    {
      title: "Modular Monolith",
      description:
        "The scale stays practical while still making domain boundaries and extraction points explicit.",
    },
    {
      title: "Package by Domain with Layers",
      description:
        "Business capabilities define the top-level structure, with controller-service-repository kept inside each module for clarity.",
    },
    {
      title: "Concrete Services, External Ports",
      description:
        "No empty Service/Impl ceremony. Abstractions exist only at real boundaries such as storage and outbound messaging.",
    },
    {
      title: "Modulith and ArchUnit",
      description:
        "The boundaries are not just documented. They are enforced with tests.",
    },
  ],
} as const;

export async function HomeScreen({
  locale,
}: {
  locale: Locale;
}) {
  const labels = copy[locale];
  const [overview, featuredProjects, experience, skills] = await Promise.all([
    getSiteOverview(locale),
    getProjects(locale, true),
    getExperience(locale),
    getSkills(locale),
  ]);
  const primaryResume = overview.resumes[0];

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="animate-rise pt-2 sm:pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b5b3a]">
            {labels.heroEyebrow}
          </p>
          <h1 className="mt-6 max-w-[11ch] text-balance break-keep font-serif text-[2.25rem] leading-[0.95] text-black sm:text-[3.25rem] lg:text-[4.15rem] xl:text-[4.65rem]">
            {overview.site.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/76 sm:text-xl sm:leading-9">
            {overview.site.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={localizePath("/projects", locale)}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              {labels.heroPrimary}
            </Link>
            {primaryResume ? (
              <Link
                href={primaryResume.fileUrl}
                target="_blank"
                className="rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-black transition hover:bg-white"
              >
                {labels.heroSecondary}
              </Link>
            ) : null}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-black/68">
            {overview.site.heroDescription}
          </p>
        </div>

        <aside className="glass-panel rounded-[2.2rem] border border-black/8 bg-white/70 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {overview.achievements.map((achievement) => (
              <article
                key={achievement.title}
                className="rounded-[1.6rem] border border-black/8 bg-[#faf5ee] p-4"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                  {achievement.title}
                </p>
                <p className="mt-3 font-serif text-[3rem] leading-[0.9] text-black">
                  {achievement.metric}
                </p>
                <p className="mt-3 text-sm leading-6 text-black/62">
                  {achievement.summary}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.7rem] border border-black/8 bg-black/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5b3a]">
              API / CMS / Deployment
            </p>
            <p className="mt-4 text-base leading-8 text-black/68">
              Spring Boot 3.4, Java 21, PostgreSQL, Flyway, Spring Security,
              Next.js App Router, Docker Compose, MinIO/R2, and OCI-ready
              deployment are treated as one coherent platform rather than
              disconnected tools.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-8">
        <SectionHeading
          eyebrow={labels.architectureEyebrow}
          title={labels.architectureTitle}
          description={labels.architectureDescription}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {architecturePrinciples[locale].map((item) => (
            <article
              key={item.title}
              className="glass-panel rounded-[1.85rem] border border-black/8 bg-white/70 p-6"
            >
              <h3 className="font-serif text-3xl leading-tight text-black">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-black/62">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8">
        <SectionHeading
          eyebrow={labels.projectsEyebrow}
          title={labels.projectsTitle}
          description={labels.projectsDescription}
        />
        <div className="grid gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeading
          eyebrow={labels.experienceEyebrow}
          title={labels.experienceTitle}
          description={labels.experienceDescription}
        />
        <ExperienceTimeline items={experience} />
      </section>

      <section className="grid gap-8">
        <SectionHeading
          eyebrow={labels.skillsEyebrow}
          title={labels.skillsTitle}
          description={labels.skillsDescription}
        />
        <SkillGrid groups={skills} />
      </section>

      <section className="glass-panel rounded-[2.2rem] border border-black/8 bg-white/70 p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeading
            eyebrow={labels.resumeEyebrow}
            title={labels.resumeTitle}
            description={labels.resumeDescription}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {overview.resumes.map((resume) => (
              <Link
                key={`${resume.languageCode}-${resume.id}`}
                href={resume.fileUrl}
                target="_blank"
                className="rounded-[1.7rem] border border-black/8 bg-[#faf5ee] p-5 transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b5b3a]">
                  {resume.languageCode}
                </p>
                <h3 className="mt-3 font-serif text-3xl text-black">
                  {resume.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-black/56">
                  {resume.fileName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export async function ProjectsScreen({
  locale,
}: {
  locale: Locale;
}) {
  const labels = copy[locale];
  const projects = await getProjects(locale);

  return (
    <div className="grid gap-8">
      <SectionHeading
        eyebrow={labels.projectsPageEyebrow}
        title={labels.projectsPageTitle}
        description={labels.projectsPageDescription}
      />
      <div className="grid gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </div>
  );
}

export async function ProjectDetailScreen({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const labels = copy[locale];
  const project = await getProject(locale, slug);

  return (
    <div className="grid gap-8">
      <Link
        href={localizePath("/projects", locale)}
        className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5b3a]"
      >
        {labels.backToProjects}
      </Link>

      <section
        className="glass-panel overflow-hidden rounded-[2.4rem] border border-black/8 bg-white/70"
        style={{
          boxShadow: `0 30px 90px color-mix(in srgb, ${project.themeColor ?? "#8b5b3a"} 12%, transparent)`,
        }}
      >
        <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b5b3a]">
              Case Study
            </p>
            <h1 className="mt-5 max-w-[12ch] text-balance break-keep font-serif text-[2.3rem] leading-[0.96] text-black sm:text-[3.4rem] lg:text-[4rem]">
              {project.title}
            </h1>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-black/48">
              {project.subtitle}
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-black/72">
              {project.overview}
            </p>
          </div>
          <div className="rounded-[2rem] border border-black/8 bg-[#faf5ee] p-4">
            <div
              className="aspect-[4/3] rounded-[1.6rem] bg-cover bg-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                backgroundImage: project.coverImageUrl
                  ? `linear-gradient(135deg, color-mix(in srgb, ${project.themeColor ?? "#8b5b3a"} 20%, transparent), rgba(255,255,255,0.65)), url(${project.coverImageUrl})`
                  : undefined,
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          { label: labels.problem, value: project.problem },
          { label: labels.role, value: project.role },
          { label: labels.architecture, value: project.architecture },
          { label: labels.outcome, value: project.outcome },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.8rem] border border-black/8 bg-white/70 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8b5b3a]">
              {item.label}
            </p>
            <p className="mt-4 text-base leading-8 text-black/72">{item.value}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-8">
        {project.sections.map((section) => (
          <ProjectBlockRenderer
            key={`${section.type}-${section.sortOrder}`}
            section={section}
          />
        ))}
      </div>

      <section className="rounded-[1.8rem] border border-black/8 bg-black text-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d5a47e]">
          CMS
        </p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/72">
          {labels.adminNote}
        </p>
      </section>
    </div>
  );
}

export async function ExperienceScreen({
  locale,
}: {
  locale: Locale;
}) {
  const labels = copy[locale];
  const [experience, skills] = await Promise.all([
    getExperience(locale),
    getSkills(locale),
  ]);

  return (
    <div className="grid gap-8">
      <SectionHeading
        eyebrow={labels.experiencePageEyebrow}
        title={labels.experiencePageTitle}
        description={labels.experiencePageDescription}
      />
      <ExperienceTimeline items={experience} />
      <SkillGrid groups={skills} />
    </div>
  );
}

export async function ContactScreen({
  locale,
}: {
  locale: Locale;
}) {
  const labels = copy[locale];
  const overview = await getSiteOverview(locale);

  return (
    <div className="grid gap-8">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow={labels.contactPageEyebrow}
          title={labels.contactPageTitle}
          description={labels.contactPageDescription}
        />
        <div className="glass-panel rounded-[2rem] border border-black/8 bg-white/70 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${overview.site.contactEmail}`}
              className="rounded-[1.5rem] border border-black/8 bg-[#faf5ee] p-5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-black/38">
                Email
              </p>
              <p className="mt-3 font-serif text-3xl text-black">
                {overview.site.contactEmail}
              </p>
            </a>
            <div className="rounded-[1.5rem] border border-black/8 bg-[#faf5ee] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-black/38">
                Phone
              </p>
              <p className="mt-3 font-serif text-3xl text-black">
                {overview.site.contactPhone ?? "-"}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {overview.site.githubUrl ? (
              <a
                href={overview.site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                GitHub
              </a>
            ) : null}
            {overview.site.linkedInUrl ? (
              <a
                href={overview.site.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <ContactForm locale={locale} />
    </div>
  );
}
