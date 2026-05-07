"use client";

import type { DeviceType } from "@/animations/types";
import { PhoneUI } from "./PhoneUI";

type R = (key: string) => (n: HTMLElement | null) => void;

type Props = {
  animationId: string;
  device: DeviceType;
  register: R;
};

function pxOrFull(device: DeviceType) {
  return device === "macbook" ? "h-full w-full" : "h-full w-full min-h-0 min-w-0";
}

export function AnimationScene({ animationId, device, register }: Props) {
  const r = register;
  const wrap = `relative ${pxOrFull(device)}`;

  switch (animationId) {
    case "slide-up":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex h-full min-h-0 flex-col gap-2.5 py-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  ref={r(`card${i}`)}
                  className="rounded-[12px]"
                  style={{ height: 52, background: i === 0 ? "#e8ff47" : "#1a1a1a" }}
                />
              ))}
            </div>
          </PhoneUI>
        </div>
      );
    case "scale-pop":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex h-full w-full items-center justify-center gap-4">
              {["♥", "★", "↑"].map((s, i) => (
                <div
                  key={s}
                  ref={r(`pop${i}`)}
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-[22px]"
                  style={{ background: "#e8ff47" }}
                >
                  {s}
                </div>
              ))}
            </div>
          </PhoneUI>
        </div>
      );
    case "fade-blur":
      return (
        <div className={wrap}>
          <PhoneUI dark>
            <div
              ref={r("card")}
              className="rounded-2xl border border-[#333] p-4"
              style={{ background: "#1a1a1a" }}
            >
              <div className="mb-2.5 h-9 w-9 rounded-[10px]" style={{ background: "#e8ff47" }} />
              <div className="mb-2 h-3 w-[70%] rounded-md bg-[#333]" />
              <div className="mb-3.5 h-2.5 w-[90%] rounded-md bg-[#2a2a2a]" />
              <div
                className="mt-2 flex h-9 items-center justify-center text-xs font-bold text-black"
                style={{ borderRadius: 10, background: "#e8ff47" }}
              >
                Continue
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "skeleton": {
      const g =
        "linear-gradient(90deg,#222 25%,#333 50%,#222 75%)";
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex min-h-0 flex-col gap-2.5">
              <div className="flex min-h-0 items-center gap-2.5">
                <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-[#222]" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 h-2.5 w-[60%] rounded bg-[#222]" />
                  <div className="h-2 w-[80%] rounded bg-[#1a1a1a]" />
                </div>
              </div>
              <div
                ref={r("sk")}
                className="h-14 rounded-xl"
                style={{
                  background: g,
                  backgroundSize: "200% 100%",
                }}
              />
              <div className="h-2.5 w-4/5 rounded bg-[#222]" />
              <div className="h-2.5 w-3/5 rounded bg-[#1a1a1a]" />
              <div className="h-2.5 w-[70%] rounded bg-[#2a2a2a]" />
            </div>
          </PhoneUI>
        </div>
      );
    }
    case "bottom-sheet":
      return (
        <div className={wrap}>
          <PhoneUI dark>
            <div className="relative h-full min-h-0 overflow-hidden">
              <div
                ref={r("overlay")}
                className="absolute inset-0 flex items-end"
                style={{ background: "rgba(0,0,0,0)" }}
              >
                <div
                  ref={r("sheet")}
                  className="w-full rounded-t-2xl border border-[#333] p-4"
                  style={{ background: "#1a1a1a" }}
                >
                  <div className="mb-2.5 mx-auto h-1 w-8 rounded" style={{ background: "#444" }} />
                  {["Share", "Copy link", "Save", "Report"].map((label, i) => (
                    <div
                      key={label}
                      className="mb-0 flex h-10 items-center gap-2.5 text-[13px]"
                      style={{
                        borderBottom: i < 3 ? "1px solid #2a2a2a" : "none",
                        color: i === 3 ? "#ff4444" : "#e0e0e0",
                      }}
                    >
                      <div className="h-7 w-7 rounded-lg bg-[#2a2a2a]" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "stagger-list":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex flex-col gap-2">
              {["Design", "Prototype", "Handoff", "Launch"].map((label, i) => (
                <div
                  key={label}
                  ref={r(`item${i}`)}
                  className="flex h-11 items-center gap-2.5 rounded-[10px] border border-[#2a2a2a] px-3"
                  style={{ background: "#1a1a1a" }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: i === 0 ? "#e8ff47" : "#444" }}
                  />
                  <span className="text-[13px] text-[#e0e0e0]">{label}</span>
                </div>
              ))}
            </div>
          </PhoneUI>
        </div>
      );
    case "flip-card":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div
              className="flex h-full w-full min-h-0 min-w-0 items-center justify-center"
              style={{ perspective: 800 }}
            >
              <div className="relative" style={{ width: "100%", minHeight: 200 }}>
                <div
                  ref={r("flipRoot")}
                  className="absolute left-1/2 top-0"
                  style={{
                    width: "100%",
                    maxWidth: 220,
                    minHeight: 200,
                    transform: "translateX(-50%)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-[200px] w-full overflow-hidden rounded-2xl border border-[#2a2a2a] text-center text-sm"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: "linear-gradient(180deg, #1e1e1e, #111)",
                      lineHeight: "200px",
                      color: "#e0e0e0",
                    }}
                  >
                    Front
                  </div>
                  <div
                    className="absolute left-0 top-0 h-[200px] w-full overflow-hidden rounded-2xl border-2 text-center text-sm"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderColor: "#e8ff47",
                      lineHeight: "200px",
                      color: "#e8ff47",
                      background: "#0a0a0a",
                    }}
                  >
                    Back
                  </div>
                </div>
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "zoom-center":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex h-full w-full min-h-0 min-w-0 items-center justify-center p-1">
              <div
                ref={r("zoom")}
                className="w-full max-w-[180px] rounded-2xl border border-[#333] p-4"
                style={{ background: "#1a1a1a" }}
              >
                <div className="mb-2.5 h-2 w-2/3 rounded bg-[#333]" />
                <div className="h-2 w-full rounded bg-[#2a2a2a]" />
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "crossfade":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="relative h-40 w-full min-w-0">
              <div
                ref={r("cfa")}
                className="absolute inset-0 flex items-center justify-center rounded-2xl"
                style={{ background: "#e8ff47", color: "#000" }}
              >
                A
              </div>
              <div
                ref={r("cfb")}
                className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0"
                style={{ background: "#1a1a1a" }}
              >
                B
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "ripple-tap":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="relative flex h-full w-full min-h-0 min-w-0 items-center justify-center">
              <div
                ref={r("rip")}
                className="pointer-events-none h-4 w-4"
                style={{
                  borderRadius: 9999,
                  background: "rgba(232,255,71,0.4)",
                }}
              />
            </div>
          </PhoneUI>
        </div>
      );
    case "toggle-switch":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex h-full w-full items-center justify-center">
              <div
                ref={r("track")}
                className="relative h-8 w-14 rounded-full"
                style={{ background: "#2a2a2a" }}
              >
                <div
                  ref={r("thumb")}
                  className="absolute top-1 h-6 w-6 rounded-full"
                  style={{ left: 4, background: "#e8ff47", boxShadow: "0 2px 4px #0003" }}
                />
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "like-heart":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="relative flex h-full w-full min-h-0 min-w-0 items-center justify-center">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  ref={r(`pt${i}`)}
                  className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
                  style={{ left: "50%", top: "50%", background: "#e8ff47", marginLeft: -3, marginTop: -3 }}
                />
              ))}
              <div ref={r("heart")} className="text-2xl" style={{ color: "#e8ff47" }}>
                ♥
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "progress-bar":
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="pt-1">
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "#1e1e1e" }}>
                <div
                  ref={r("fill")}
                  className="h-full w-0 rounded-full"
                  style={{ background: "#e8ff47" }}
                />
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "typing-dots":
      return (
        <div className={wrap}>
          <PhoneUI dark>
            <div className="flex h-16 items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  ref={r(`d${i}`)}
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#666" }}
                />
              ))}
            </div>
          </PhoneUI>
        </div>
      );
    case "circular-spinner": {
      const s = 44;
      return (
        <div className={wrap}>
          <PhoneUI>
            <div className="flex h-full w-full min-h-0 min-w-0 items-center justify-center p-1">
              <div
                ref={r("spin")}
                className="rounded-full"
                style={{
                  width: s,
                  height: s,
                  border: "3px solid #222",
                  borderTopColor: "#e8ff47",
                }}
              />
            </div>
          </PhoneUI>
        </div>
      );
    }
    case "parallax-reveal":
      return (
        <div className={wrap}>
          <PhoneUI dark>
            <div
              className="relative h-40 w-full overflow-hidden rounded-2xl"
              style={{ background: "#0a0a0a" }}
            >
              <div
                ref={r("plxBack")}
                className="absolute -left-3 -right-3 top-0 h-40 opacity-30"
                style={{ background: "radial-gradient(circle at 30% 20%, #3a2a0a, transparent 55%)" }}
              />
              <div
                ref={r("plxFore")}
                className="absolute inset-2 rounded-xl border border-[#333] p-3"
                style={{ background: "rgba(26,26,26,0.85)" }}
              >
                <p className="text-xs text-[#ccc]">Content rides above a slower layer.</p>
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    case "sticky-header-shrink":
      return (
        <div className={wrap}>
          <PhoneUI dark>
            <div className="flex h-full w-full min-h-0 min-w-0 flex-col">
              <div
                ref={r("stkHead")}
                className="w-full"
                style={{
                  display: "flex",
                  height: 56,
                  fontWeight: 800,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid #1e1e1e",
                  color: "#fff",
                  background: "#111",
                }}
              >
                Sticky
              </div>
              <div className="flex-1 p-2 text-xs leading-relaxed text-[#888]">
                Scroll is simulated: scrub the zone to shrink the header and reveal content.
              </div>
            </div>
          </PhoneUI>
        </div>
      );
    default:
      return (
        <div className="flex h-full w-full min-h-0 min-w-0 items-center justify-center p-2 text-sm text-[#666]">
          Unknown animation: {animationId}
        </div>
      );
  }
}
