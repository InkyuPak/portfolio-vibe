"use client";

import { useState } from "react";

import type {
  AdminSkillGroupResponse,
  SkillGroupRequest,
} from "@/lib/api/types";

interface SkillsStudioProps {
  initialGroups: AdminSkillGroupResponse[];
}

function toRequest(group: AdminSkillGroupResponse): SkillGroupRequest {
  return {
    groupKey: group.groupKey,
    title: group.title,
    sortOrder: group.sortOrder,
    items: group.items,
  };
}

export function SkillsStudio({
  initialGroups,
}: SkillsStudioProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedId, setSelectedId] = useState(initialGroups[0]?.id ?? 0);
  const [itemsJson, setItemsJson] = useState(
    initialGroups[0] ? JSON.stringify(initialGroups[0].items, null, 2) : "[]",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = groups.find((group) => group.id === selectedId) ?? groups[0];

  function syncSelection(nextId: number) {
    const next = groups.find((group) => group.id === nextId);
    setSelectedId(nextId);
    setItemsJson(next ? JSON.stringify(next.items, null, 2) : "[]");
    setMessage(null);
  }

  async function createGroup() {
    setBusy(true);
    const response = await fetch("/api/admin/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupKey: `group-${Date.now()}`,
        title: { ko: "새 그룹", en: "New Group" },
        sortOrder: groups.length + 1,
        items: [
          {
            name: "Item",
            description: { ko: "설명", en: "Description" },
            sortOrder: 1,
          },
        ],
      }),
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("기술 그룹 생성에 실패했습니다.");
      return;
    }

    const created = (await response.json()) as AdminSkillGroupResponse;
    const next = [created, ...groups];
    setGroups(next);
    setSelectedId(created.id);
    setItemsJson(JSON.stringify(created.items, null, 2));
    setMessage("새 기술 그룹을 생성했습니다.");
  }

  async function saveGroup() {
    if (!selected) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(`/api/admin/skills/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...toRequest(selected),
          items: JSON.parse(itemsJson),
        }),
      });

      if (!response.ok) {
        setMessage("기술 그룹 저장에 실패했습니다.");
        return;
      }

      const saved = (await response.json()) as AdminSkillGroupResponse;
      setGroups((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      );
      setItemsJson(JSON.stringify(saved.items, null, 2));
      setMessage("기술 그룹을 저장했습니다.");
    } catch {
      setMessage("items JSON 형식을 확인해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteGroup() {
    if (!selected || !window.confirm("이 기술 그룹을 삭제할까요?")) {
      return;
    }

    setBusy(true);
    const response = await fetch(`/api/admin/skills/${selected.id}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("기술 그룹 삭제에 실패했습니다.");
      return;
    }

    const next = groups.filter((item) => item.id !== selected.id);
    setGroups(next);
    syncSelection(next[0]?.id ?? 0);
    setMessage("기술 그룹을 삭제했습니다.");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <button
          type="button"
          onClick={() => void createGroup()}
          disabled={busy}
          className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
        >
          새 기술 그룹
        </button>
        <div className="mt-4 grid gap-3">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => syncSelection(group.id)}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedId === group.id
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.08]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] opacity-60">
                {group.groupKey}
              </p>
              <p className="mt-2 font-semibold">{group.title.ko}</p>
              <p className="mt-2 text-sm opacity-70">{group.items.length} items</p>
            </button>
          ))}
        </div>
      </aside>

      {selected ? (
        <section className="glass-panel rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5cf6]">
                Skill Group Editor
              </p>
              <h2 className="mt-3 font-sans text-4xl text-white">
                {selected.title.ko}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveGroup()}
                disabled={busy}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 [background:linear-gradient(135deg,#7c3aed,#4f46e5)]"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => void deleteGroup()}
                disabled={busy}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/72"
              >
                삭제
              </button>
            </div>
          </div>
          {message ? <p className="mt-4 text-sm text-[#8b5cf6]">{message}</p> : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Group Key", selected.groupKey, "groupKey"],
              ["Title (KO)", selected.title.ko, "title.ko"],
              ["Title (EN)", selected.title.en ?? "", "title.en"],
            ].map(([label, value, key]) => (
              <label key={label as string} className="grid gap-2 text-sm text-white/72">
                <span>{label as string}</span>
                <input
                  value={value as string}
                  onChange={(event) =>
                    setGroups((current) =>
                      current.map((item) =>
                        item.id !== selected.id
                          ? item
                          : key === "groupKey"
                            ? { ...item, groupKey: event.target.value }
                            : key === "title.ko"
                              ? {
                                  ...item,
                                  title: { ...item.title, ko: event.target.value },
                                }
                              : {
                                  ...item,
                                  title: { ...item.title, en: event.target.value },
                                },
                      ),
                    )
                  }
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white"
                />
              </label>
            ))}
          </div>

          <label className="mt-4 grid gap-2 text-sm text-white/72">
            <span>Items JSON</span>
            <textarea
              rows={18}
              value={itemsJson}
              onChange={(event) => setItemsJson(event.target.value)}
              className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-white"
            />
          </label>
        </section>
      ) : null}
    </section>
  );
}
