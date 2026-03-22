import type { PublicExperienceResponse } from "@/lib/api/types";

interface ExperienceTimelineProps {
  items: PublicExperienceResponse[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative overflow-hidden rounded-2xl p-6 transition-all duration-200"
          style={{
            background: idx === 0 ? "rgba(139,92,246,0.07)" : "rgba(255,255,255,0.02)",
            border: idx === 0
              ? "1px solid rgba(139,92,246,0.22)"
              : "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* top gradient bar — only on first (current) item */}
          {idx === 0 && (
            <div
              className="absolute left-0 right-0 top-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5, transparent)" }}
            />
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex-1">
              {/* Current badge */}
              {idx === 0 && (
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" }}
                >
                  <span
                    className="inline-block rounded-full"
                    style={{ width: 5, height: 5, background: "#34d399", animation: "pulse-dot 2s infinite" }}
                  />
                  재직중
                </div>
              )}

              {/* Company */}
              <p
                className="mb-1 text-[11px] font-semibold uppercase tracking-[2px]"
                style={{ color: idx === 0 ? "#8b5cf6" : "rgba(249,250,251,0.35)" }}
              >
                {item.companyName}
              </p>

              {/* Role */}
              <h3 className="text-lg font-bold text-white">{item.roleTitle}</h3>

              {/* Period + location */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs"
                  style={{
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.18)",
                    color: "rgba(249,250,251,0.50)",
                  }}
                >
                  {item.periodLabel}
                </span>
                {item.location && (
                  <span className="text-xs" style={{ color: "rgba(249,250,251,0.30)" }}>
                    {item.location}
                  </span>
                )}
              </div>

              {/* Summary */}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(249,250,251,0.50)" }}>
                {item.summary}
              </p>

              {/* Highlights */}
              {item.highlights.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {item.highlights.map((h, hi) => (
                    <li key={hi} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(249,250,251,0.65)" }}>
                      <span
                        className="mt-[6px] shrink-0 rounded-full"
                        style={{ width: 4, height: 4, background: "#8b5cf6" }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
