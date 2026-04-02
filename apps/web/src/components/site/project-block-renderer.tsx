import ReactMarkdown from "react-markdown";

import type { PublicProjectSectionResponse } from "@/lib/api/types";

function MetricsBlock({
  payload,
  accent,
}: {
  payload: Record<string, unknown>;
  accent: string;
}) {
  const items = Array.isArray(payload.items) ? payload.items : [];

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl" style={{ border: `1px solid ${accent}22` }}>
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const record = item as { label?: string; value?: string; note?: string };
          return (
            <article
              key={`${record.label}-${index}`}
              className="flex flex-col gap-2 p-6"
              style={{ background: "rgba(5,5,15,0.80)" }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[3px]"
                style={{ color: "rgba(249,250,251,0.30)" }}
              >
                {record.label}
              </p>
              <p
                className="font-sans text-4xl font-black leading-none"
                style={{
                  background: `linear-gradient(135deg, #fff 20%, ${accent})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {record.value}
              </p>
              {record.note ? (
                <p className="text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.38)" }}>
                  {record.note}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ListBlock({
  payload,
  accent,
  numeric,
}: {
  payload: Record<string, unknown>;
  accent: string;
  numeric?: boolean;
}) {
  const items = Array.isArray(payload.items) ? payload.items : [];

  return (
    <div className="relative flex flex-col gap-0">
      {/* vertical connector line */}
      <div
        className="absolute left-[19px] top-8 bottom-8 w-px"
        style={{ background: `linear-gradient(to bottom, ${accent}55, ${accent}11)` }}
      />
      {items.map((item, index) => {
        const record = item as { title?: string; description?: string };
        return (
          <div key={`${record.title}-${index}`} className="relative flex gap-5 pb-6 last:pb-0">
            {/* Step number bubble */}
            <div
              className="relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black"
              style={{
                background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                border: `1.5px solid ${accent}50`,
                color: accent,
              }}
            >
              {numeric ? String(index + 1).padStart(2, "0") : "·"}
            </div>

            <div className="flex-1 pt-1">
              <h4 className="text-base font-bold text-white leading-snug">{record.title}</h4>
              <p className="mt-1.5 text-sm leading-7" style={{ color: "rgba(249,250,251,0.50)" }}>
                {record.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GalleryBlock({
  payload,
  accent,
}: {
  payload: Record<string, unknown>;
  accent: string;
}) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const hasImages = items.some(
    (item) => (item as { imageUrl?: string }).imageUrl,
  );

  if (hasImages) {
    const isSingle = items.length === 1;

    return (
      <div className={isSingle ? "flex justify-center" : "grid gap-4 sm:grid-cols-2"}>
        {items.map((item, index) => {
          const record = item as {
            imageUrl?: string;
            caption?: string;
            title?: string;
          };
          return (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-xl"
              style={{
                background: "rgba(5,5,15,0.70)",
                border: `1px solid ${accent}22`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent}10`,
                maxWidth: isSingle ? 640 : undefined,
              }}
            >
              {/* Browser chrome bar */}
              <div
                className="flex shrink-0 items-center gap-1.5 px-3 py-2"
                style={{
                  background: "rgba(5,5,15,0.90)",
                  borderBottom: `1px solid ${accent}15`,
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: "rgba(255,95,86,0.7)" }} />
                <span className="h-2 w-2 rounded-full" style={{ background: "rgba(255,189,46,0.7)" }} />
                <span className="h-2 w-2 rounded-full" style={{ background: "rgba(40,200,64,0.7)" }} />
              </div>

              {/* Image */}
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{ height: 280, background: "rgba(5,5,15,0.90)" }}
              >
                <img
                  src={record.imageUrl}
                  alt={record.caption ?? record.title ?? ""}
                  className="max-h-full max-w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ display: "block", objectFit: "contain" }}
                />
              </div>

              {/* Caption */}
              {(record.caption ?? record.title) && (
                <div
                  className="px-4 py-3"
                  style={{ borderTop: `1px solid ${accent}15` }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(249,250,251,0.65)" }}
                  >
                    {record.caption ?? record.title}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // fallback: text list
  return <ListBlock payload={payload} accent={accent} />;
}

const COLS = 3;

function DiagramBlock({
  payload,
  accent,
}: {
  payload: Record<string, unknown>;
  accent: string;
}) {
  const nodes = Array.isArray(payload.nodes) ? payload.nodes : [];

  // Split into rows of COLS
  const rows: Array<{ node: string; globalIdx: number }[]> = [];
  for (let i = 0; i < nodes.length; i += COLS) {
    rows.push(
      nodes.slice(i, i + COLS).map((n, j) => ({ node: String(n), globalIdx: i + j })),
    );
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(5,5,15,0.70)", border: `1px solid ${accent}20` }}
    >
      <div className="flex flex-col gap-3">
        {rows.map((row, rowIdx) => {
          const isReversed = rowIdx % 2 === 1;
          const displayRow = isReversed ? [...row].reverse() : row;
          return (
            <div key={rowIdx}>
              {/* Down-arrow connector between rows — right side for even→odd, left side for odd→even */}
              {rowIdx > 0 && (
                <div
                  className={`mb-3 flex ${isReversed ? "justify-end pr-[calc(100%/3/2-8px)]" : "justify-start pl-[calc(100%/3/2-8px)]"}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-px" style={{ background: `${accent}50` }} />
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <polyline
                        points="1,1 7,7 13,1"
                        stroke={`${accent}90`}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Node row */}
              <div className="flex items-stretch gap-0">
                {displayRow.map(({ node, globalIdx }, colIdx) => (
                  <div key={globalIdx} className="flex flex-1 items-center">
                    {/* Node card */}
                    <div
                      className="flex flex-1 flex-col gap-2 rounded-xl p-4 text-center"
                      style={{
                        background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                        border: `1px solid ${accent}35`,
                      }}
                    >
                      <span
                        className="text-[9px] font-black tracking-[3px]"
                        style={{ color: `${accent}dd` }}
                      >
                        {String(globalIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-center text-xs font-semibold leading-snug text-white sm:text-sm">
                        {node}
                      </span>
                    </div>

                    {/* Arrow between nodes within a row */}
                    {colIdx < displayRow.length - 1 ? (
                      <div className="flex shrink-0 items-center px-1.5">
                        {isReversed ? (
                          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                            <line x1="20" y1="7" x2="7" y2="7" stroke={`${accent}50`} strokeWidth="1.5" />
                            <polyline
                              points="12,2 6,7 12,12"
                              fill="none"
                              stroke={`${accent}80`}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                            <line x1="0" y1="7" x2="13" y2="7" stroke={`${accent}50`} strokeWidth="1.5" />
                            <polyline
                              points="8,2 14,7 8,12"
                              fill="none"
                              stroke={`${accent}80`}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tech-stack card renderer ──────────────────────────────── */
interface TechSection {
  title: string;
  badges: string[];
  description: string;
}

function parseTechSections(markdown: string): TechSection[] {
  const blocks = markdown.trim().split(/^### /m).filter(Boolean);
  return blocks.map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const title = lines[0] ?? "";
    const badgeLine = lines.find((l) => l.startsWith("`"));
    const badges = badgeLine
      ? [...badgeLine.matchAll(/`([^`]+)`/g)].map((m) => m[1])
      : [];
    const description = lines
      .filter((l) => l !== title && l !== badgeLine)
      .join(" ")
      .trim();
    return { title, badges, description };
  });
}

function TechStackCards({ markdown, accent }: { markdown: string; accent: string }) {
  const sections = parseTechSections(markdown);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map(({ title, badges, description }) => (
        <div
          key={title}
          className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "rgba(5,5,15,0.75)",
            border: `1px solid ${accent}20`,
          }}
        >
          {/* Top accent stripe */}
          <div
            className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent}30)` }}
          />

          {/* Title */}
          <h4
            className="font-sans text-base font-bold leading-snug text-white"
          >
            {title}
          </h4>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold"
                  style={{
                    background: `${accent}18`,
                    border: `1px solid ${accent}35`,
                    color: accent,
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p
            className="flex-1 text-xs leading-[1.75]"
            style={{ color: "rgba(249,250,251,0.50)" }}
          >
            {description}
          </p>

          {/* Hover glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}08, transparent 60%)` }}
          />
        </div>
      ))}
    </div>
  );
}

const SECTION_TYPE_LABEL: Record<string, string> = {
  METRICS: "METRICS",
  TIMELINE: "TIMELINE",
  DIAGRAM: "DIAGRAM",
  GALLERY: "GALLERY",
  MARKDOWN: "OVERVIEW",
};

export function ProjectBlockRenderer({
  section,
  accent = "#8b5cf6",
}: {
  section: PublicProjectSectionResponse;
  accent?: string;
}) {
  const markdown = String(section.payload.markdown ?? "");
  const isTechCards = section.type === "MARKDOWN" && markdown.trim().startsWith("###");

  return (
    <section className="flex flex-col gap-5">
      {/* Section heading */}
      <div className="flex items-center gap-4">
        <div
          className="h-px flex-1"
          style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }}
        />
        <span
          className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[3px]"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          {SECTION_TYPE_LABEL[section.type] ?? section.type}
        </span>
      </div>

      <h3 className="font-sans text-2xl font-bold leading-tight text-white sm:text-3xl">
        {section.title}
      </h3>

      {section.type === "METRICS" ? (
        <MetricsBlock payload={section.payload} accent={accent} />
      ) : null}
      {section.type === "TIMELINE" ? (
        <ListBlock payload={section.payload} accent={accent} numeric />
      ) : null}
      {section.type === "GALLERY" ? (
        <GalleryBlock payload={section.payload} accent={accent} />
      ) : null}
      {section.type === "DIAGRAM" ? (
        <DiagramBlock payload={section.payload} accent={accent} />
      ) : null}
      {section.type === "MARKDOWN" && isTechCards ? (
        <TechStackCards markdown={markdown} accent={accent} />
      ) : null}
      {section.type === "MARKDOWN" && !isTechCards ? (
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(5,5,15,0.70)", border: `1px solid ${accent}18` }}
        >
          <article className="prose prose-invert max-w-none prose-headings:font-sans prose-headings:font-bold prose-p:text-white/55 prose-p:leading-7 prose-li:text-white/55 prose-strong:text-white prose-strong:font-semibold prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.8em] prose-a:no-underline">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </article>
        </div>
      ) : null}
    </section>
  );
}
