"use client";

import { animations } from "@/animations";
import type { Animation, DeviceType, ScrubRefMap } from "@/animations/types";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimationScene } from "./AnimationScene";
import { DeviceMockup } from "./DeviceMockup";
import { RightPanel } from "./RightPanel";
import { ScrubZone, useScrubReplay } from "./ScrubZone";
import { Sidebar } from "./Sidebar";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
const DEV: Array<{ id: DeviceType; label: string }> = [
  { id: "iphone", label: "iPhone" },
  { id: "android", label: "Android" },
  { id: "macbook", label: "MacBook" },
];

type Props = { animation: Animation };

export default function AnimView({ animation }: Props) {
  const device = useAppStore((s) => s.device);
  const setDevice = useAppStore((s) => s.setDevice);
  const setSelected = useAppStore((s) => s.setSelectedAnimationId);
  const setLastP = useAppStore((s) => s.setLastScrubProgress);
  const [speed, setSpeed] = useState(1);

  const router = useRouter();
  const scrubRefs = useRef<ScrubRefMap>({});
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  const play = useScrubReplay(animation, scrubRefs, progressTextRef, speed);

  useLayoutEffect(() => {
    for (const k of Object.keys(scrubRefs.current)) {
      delete scrubRefs.current[k];
    }
  }, [animation.id]);

  useEffect(() => {
    setSelected(animation.id);
  }, [animation.id, setSelected]);

  const register = useCallback((key: string) => (n: HTMLElement | null) => {
    scrubRefs.current[key] = n;
  }, []);

  const onNav = useCallback(
    (dir: -1 | 1) => {
      const idx = animations.findIndex((a) => a.id === animation.id);
      if (idx < 0) return;
      const next = animations[(idx + dir + animations.length) % animations.length];
      router.push(`/animations/${next.id}`);
    },
    [animation.id, router]
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (e.code === "Space") {
        e.preventDefault();
        play();
      } else if (e.code === "ArrowRight") onNav(1);
      else if (e.code === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onNav, play]);

  const onReplay = () => {
    play();
  };

  return (
    <div
      className="flex min-h-dvh flex-col font-sans antialiased"
      style={{ background: "#0a0a0a", color: "#e0e0e0" }}
    >
      <header
        className="flex h-[52px] shrink-0 items-center justify-between border-b border-line px-6"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-[22px] w-[22px] rounded-md"
            style={{ background: "#e8ff47" }}
          />
          <span className="text-[15px] font-bold tracking-[-0.02em]">
            animpreview
          </span>
        </div>
        <div className="flex gap-1.5">
          {DEV.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className="cursor-pointer rounded-md border px-3 py-1 text-xs font-medium transition"
              style={{
                borderColor: device === d.id ? "#e8ff47" : "#222",
                background: device === d.id ? "rgba(232,255,71,0.08)" : "transparent",
                color: device === d.id ? "#e8ff47" : "#666",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </header>

      <div
        className="flex min-h-0 flex-1 overflow-hidden"
        style={{ height: "calc(100dvh - 52px)" }}
      >
        <Sidebar currentId={animation.id} />
        <main
          className="relative flex min-w-0 min-h-0 flex-1 flex-col"
          style={{ background: "#0a0a0a" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 0.3,
            }}
          />

          <ScrubZone
            key={animation.id}
            animation={animation}
            scrubRefs={scrubRefs}
            progressTextRef={progressTextRef}
            onScrubEnd={setLastP}
          >
            <div
              className="relative z-[1] flex w-full min-w-0 min-h-0 max-w-full flex-1 items-center justify-center p-2"
            >
              <div className="pointer-events-none flex max-h-full max-w-full min-h-0 min-w-0 items-center justify-center">
                <DeviceMockup device={device} className="pointer-events-none">
                  <div className="pointer-events-none min-h-0 w-full min-w-0 flex-1" key={animation.id}>
                    <AnimationScene
                      key={animation.id}
                      device={device}
                      animationId={animation.id}
                      register={register}
                    />
                  </div>
                </DeviceMockup>
              </div>
            </div>
          </ScrubZone>

          <motion.div
            className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-xl border border-[#222] px-2.5 py-2"
            style={{ background: "#111" }}
            initial={false}
            layout
          >
            <button
              type="button"
              onClick={onReplay}
              className="cursor-pointer rounded-md border-none py-1 pl-2.5 pr-3.5 text-xs font-bold"
              style={{ background: "#e8ff47", color: "#000" }}
            >
              ↺ Replay
            </button>
            <div className="h-[18px] w-px" style={{ background: "#222" }} />
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className="cursor-pointer rounded border-none py-0.5 px-1.5 text-[11px] font-semibold"
                style={{
                  background: speed === s ? "#1e1e1e" : "transparent",
                  color: speed === s ? "#e8ff47" : "#555",
                }}
              >
                {s}×
              </button>
            ))}
            <div className="h-[18px] w-px" style={{ background: "#222" }} />
            <span ref={progressTextRef} className="text-[10px] min-w-8 text-[#888] tabular-nums" />
            <div className="h-[18px] w-px" style={{ background: "#222" }} />
            <span className="whitespace-nowrap pl-0.5 text-[10px]" style={{ color: "#444" }}>
              Space = replay
            </span>
          </motion.div>
        </main>
        <RightPanel animation={animation} />
      </div>
    </div>
  );
}
