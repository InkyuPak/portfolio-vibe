import type { PublicSkillGroupResponse } from "@/lib/api/types";

interface SkillGridProps {
  groups: PublicSkillGroupResponse[];
}

export function SkillGrid({ groups }: SkillGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.groupKey}
          className="rounded-2xl p-5 transition-all duration-200"
          style={{
            background: "rgba(139,92,246,0.04)",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          <div className="mb-4">
            <p
              className="mb-1 text-[10px] font-semibold uppercase tracking-[3px]"
              style={{ color: "#8b5cf6" }}
            >
              {group.groupKey}
            </p>
            <h3 className="font-serif text-lg font-bold text-white">{group.title}</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {group.items.map((item) => (
              <li key={item.name} className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">{item.name}</span>
                <span className="text-xs leading-relaxed" style={{ color: "rgba(249,250,251,0.40)" }}>
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
