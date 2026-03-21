import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12 sm:px-8 lg:px-10">
      <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b5cf6]">
            Portfolio CMS
          </p>
          <h1 className="mt-6 font-sans text-5xl font-bold leading-[1.05] text-white sm:text-7xl">
            운영 가능한 포트폴리오는 편집기까지 완성돼야 합니다.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-white/55">
            이 CMS는 Spring Security 세션 인증, 구조화된 콘텐츠 모델, 재검증
            훅까지 실제 운영 방식으로 연결됩니다.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
