"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import type { Locale } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  company: z.string().optional(),
  message: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

const copy = {
  ko: {
    name: "이름", email: "이메일", company: "회사 (선택)", message: "메시지",
    submit: "메시지 보내기", sending: "전송 중...", success: "메시지가 전송되었습니다.",
  },
  en: {
    name: "Name", email: "Email", company: "Company (optional)", message: "Message",
    submit: "Send message", sending: "Sending...", success: "Message sent.",
  },
} as const;

interface ContactFormProps { locale: Locale; apiBase?: string; light?: boolean; }

export function ContactForm({ locale, apiBase = "", light }: ContactFormProps) {
  const c = copy[locale];
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch(`${apiBase}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  const inputStyle = {
    background: light ? "#ffffff" : "rgba(255,255,255,0.03)",
    border: light ? "1px solid rgba(139,92,246,0.20)" : "1px solid rgba(139,92,246,0.18)",
    borderRadius: 10,
    color: light ? "#1e1b4b" : "#f9fafb",
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelColor = light ? "#6b7280" : "rgba(249,250,251,0.50)";
  const borderBlur = light ? "rgba(139,92,246,0.20)" : "rgba(139,92,246,0.18)";

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)" }}
      >
        <p className="text-lg font-semibold" style={{ color: "#34d399" }}>{c.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: labelColor }}>{c.name}</label>
          <input {...register("name")} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
            onBlur={e => (e.target.style.borderColor = borderBlur)}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: labelColor }}>{c.email}</label>
          <input {...register("email")} type="email" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
            onBlur={e => (e.target.style.borderColor = borderBlur)}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: labelColor }}>{c.company}</label>
        <input {...register("company")} style={inputStyle}
          onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
          onBlur={e => (e.target.style.borderColor = borderBlur)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: labelColor }}>{c.message}</label>
        <textarea {...register("message")} rows={5} style={{ ...inputStyle, resize: "vertical" }}
          onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.55)")}
          onBlur={e => (e.target.style.borderColor = borderBlur)}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 30px rgba(124,58,237,0.25)" }}
      >
        {isSubmitting ? c.sending : c.submit}
      </button>
    </form>
  );
}
