"use client";

import Link from "next/link";
import { animations } from "@/animations";
import { useAppStore, type CategoryFilter } from "@/store/useAppStore";
import { useCallback, useMemo } from "react";

const CATS: Array<"All" | "Transitions" | "Micro" | "Loading" | "Scroll"> = [
  "All",
  "Transitions",
  "Micro",
  "Loading",
  "Scroll",
];

type Props = { currentId: string };

export function Sidebar({ currentId }: Props) {
  const setCategory = useAppStore((s) => s.setCategory);
  const setSearch = useAppStore((s) => s.setSearchQuery);
  const category = useAppStore((s) => s.category);
  const search = useAppStore((s) => s.searchQuery);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base =
      category === "All"
        ? animations
        : animations.filter((a) => a.category === category);
    if (!q) return base;
    return base.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    );
  }, [category, search]);

  const onChangeCat = useCallback(
    (c: (typeof CATS)[number]) => {
      setCategory(c as CategoryFilter);
    },
    [setCategory]
  );

  return (
    <aside className="flex w-[220px] shrink-0 flex-col overflow-hidden border-r border-line">
      <div className="shrink-0 space-y-2.5 border-b border-[#1a1a1a] p-2.5 pt-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          type="search"
          className="w-full rounded-md border border-line bg-[#0d0d0d] px-2.5 py-1.5 text-xs text-[#d0d0d0] outline-none transition placeholder:text-[#444] focus:border-[#e8ff47]/35"
        />
        <div className="flex flex-wrap gap-1">
          {CATS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => onChangeCat(c)}
              className="rounded border-none px-2 py-0.5 text-[11px] font-semibold transition"
              style={{
                background: category === c ? "#e8ff47" : "#1a1a1a",
                color: category === c ? "#000" : "#666",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        <ul className="space-y-0.5 p-0">
          {filtered.map((a) => {
            const href = `/animations/${a.id}`;
            const active = currentId === a.id;
            return (
              <li key={a.id}>
                <Link
                  href={href}
                  scroll={false}
                  className="block cursor-pointer rounded-lg px-3 py-2.5 transition"
                  style={{
                    background: active ? "#1a1a1a" : "transparent",
                    borderLeft: active
                      ? "2px solid #e8ff47"
                      : "2px solid transparent",
                  }}
                >
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: active ? "#fff" : "#c0c0c0" }}
                  >
                    {a.name}
                  </div>
                  <div
                    className="mt-0.5 text-[11px]"
                    style={{ color: "#555" }}
                  >
                    {a.category}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 && (
          <p className="p-2 text-center text-xs text-[#555]">No matches</p>
        )}
      </div>
    </aside>
  );
}
