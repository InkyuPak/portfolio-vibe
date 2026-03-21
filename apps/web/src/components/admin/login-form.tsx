"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("change-me");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        setMessage("로그인에 실패했습니다. 관리자 계정을 확인해주세요.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8b5cf6]">
          Admin Sign In
        </p>
        <h1 className="mt-4 font-sans text-4xl font-bold text-white">CMS Login</h1>
        <p className="mt-4 text-sm leading-7 text-white/50">
          Spring Security session cookie를 그대로 사용합니다. 개발 기본값은{" "}
          <code className="rounded px-1 py-0.5 text-xs text-[#8b5cf6]" style={{ background: "rgba(139,92,246,0.12)" }}>
            admin / change-me
          </code>{" "}
          입니다.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-white/65">
          <span>Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-white/65">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 24px rgba(124,58,237,0.30)" }}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
        {message ? <p className="text-sm text-red-400">{message}</p> : null}
      </div>
    </form>
  );
}
