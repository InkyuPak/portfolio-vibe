import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  gradient?: boolean;
}

export function SectionHeading({ eyebrow, title, description, center, gradient }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-3", center && "items-center text-center")}>
      {eyebrow && (
        <div className="flex items-center gap-3">
          {!center && (
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.6), transparent)" }}
            />
          )}
          <span
            className="text-[10px] font-semibold uppercase tracking-[4px]"
            style={{ color: "#8b5cf6" }}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={cn(
          "font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
          gradient ? "text-gradient" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.45)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
