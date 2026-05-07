"use client";

import type { Animation } from "@/animations/types";
import { CodePanel } from "./CodePanel";
import { useCallback, useState } from "react";

type Props = { animation: Animation };

export function RightPanel({ animation }: Props) {
  const [shareState, setShareState] = useState<"idle" | "done">("idle");

  const onShare = useCallback(() => {
    const u = new URL(
      typeof window !== "undefined" ? window.location.href : "/"
    );
    u.pathname = `/animations/${animation.id}`;
    u.search = "";
    void navigator.clipboard.writeText(u.toString());
    setShareState("done");
    setTimeout(() => setShareState("idle"), 2000);
  }, [animation.id]);

  return (
    <aside
      className="flex w-[260px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-line p-4"
    >
      <div className="flex flex-col gap-2.5">
        <div
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#444" }}
        >
          Selected
        </div>
        <div className="flex items-start justify-between gap-2">
          <h2
            className="text-[20px] font-bold leading-tight tracking-[-0.03em] text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            {animation.name}
          </h2>
          <button
            type="button"
            onClick={onShare}
            className="shrink-0 rounded-md border border-[#333] px-2.5 py-1 text-[11px] font-semibold text-[#888] transition hover:border-[#e8ff47]/40 hover:text-[#e8ff47]"
          >
            {shareState === "done" ? "Copied" : "Share"}
          </button>
        </div>
        <p className="text-[13px]" style={{ color: "#555" }}>
          {animation.description}
        </p>
        <span
          className="inline self-start rounded px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: "#e8ff47", background: "rgba(232,255,71,0.08)" }}
        >
          {animation.category}
        </span>
      </div>

      <div>
        <div
          className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#444" }}
        >
          Timing
        </div>
        <div className="mb-1 flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-line bg-[#111] px-2.5 py-2">
            <div className="mb-0.5 text-[10px] text-[#444]">Duration</div>
            <div className="text-[13px] font-semibold" style={{ color: "#ccc" }}>
              {animation.timing.duration}ms
            </div>
          </div>
          <div className="min-w-0 flex-1 rounded-lg border border-line bg-[#111] px-2.5 py-2">
            <div className="mb-0.5 text-[10px] text-[#444]">Easing</div>
            <div className="text-[13px] font-semibold" style={{ color: "#ccc" }}>
              {animation.timing.easing === "linear" ? "Linear" : "Custom"}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#444" }}
        >
          CSS Code
        </div>
        <CodePanel code={animation.css} />
      </div>

      <div
        className="mt-auto border-t border-line pt-3"
        style={{ color: "#333" }}
      >
        <p className="text-[10px]">← → navigate · Space replay · drag to scrub</p>
      </div>
    </aside>
  );
}
