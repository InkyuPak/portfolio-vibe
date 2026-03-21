import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  meta,
}: AdminPageHeaderProps) {
  return (
    <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b5cf6]">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-sans text-4xl leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-white/62 sm:text-lg">
            {description}
          </p>
        </div>
        {meta ? <div className="min-w-0">{meta}</div> : null}
      </div>
    </section>
  );
}
