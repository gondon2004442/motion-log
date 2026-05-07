"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Animation, ScrubRefMap } from "@/animations/types";

type Props = {
  animation: Animation;
  /** Mutable ref to DOM ref map; scrub mutates the same object each frame */
  scrubRefs: React.MutableRefObject<ScrubRefMap>;
  children: React.ReactNode;
  /** Shown in UI without React re-renders: updated via textContent in rAF */
  progressTextRef: React.RefObject<HTMLSpanElement | null>;
  onScrubEnd?: (p: number) => void;
};

/**
 * Horizontally scrub progress 0–1, applies animation.scrub in requestAnimationFrame only.
 * No setState for pointer position.
 */
export function ScrubZone({
  animation,
  scrubRefs,
  children,
  progressTextRef,
  onScrubEnd,
}: Props) {
  const progress = useRef(0);
  const raf = useRef<number | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const animationRef = useRef(animation);
  animationRef.current = animation;

  const runScrub = useCallback((p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    progress.current = clamped;
    animationRef.current.scrub(clamped, scrubRefs.current);
    const t = progressTextRef.current;
    if (t) t.textContent = `${Math.round(clamped * 100)}%`;
  }, [progressTextRef, scrubRefs]);

  const schedule = useCallback(() => {
    if (raf.current != null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      runScrub(progress.current);
    });
  }, [runScrub]);

  const relFromEvent = (clientX: number) => {
    const z = zoneRef.current;
    if (!z) return 0;
    const r = z.getBoundingClientRect();
    if (r.width <= 0) return 0;
    return (clientX - r.left) / r.width;
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    progress.current = relFromEvent(e.clientX);
    runScrub(progress.current);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    progress.current = relFromEvent(e.clientX);
    schedule();
  };

  const onUp = (e: React.PointerEvent) => {
    if (dragging.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    dragging.current = false;
    onScrubEnd?.(progress.current);
  };

  useEffect(() => {
    progress.current = 0;
    const id0 = requestAnimationFrame(() => {
      runScrub(0);
      requestAnimationFrame(() => runScrub(0));
    });
    return () => cancelAnimationFrame(id0);
  }, [animation.id, runScrub]);

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <div
        className="relative z-0 flex min-h-0 min-w-0 flex-1 items-center justify-center p-4"
        style={{ touchAction: "manipulation" }}
      >
        {children}
        <div
          ref={zoneRef}
          className="absolute inset-0 z-20 cursor-ew-resize"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerEnter={(e) => {
            if (e.buttons) {
              onMove(e);
            }
          }}
          onLostPointerCapture={onUp as unknown as React.PointerEventHandler}
          style={{ touchAction: "none" }}
          aria-label="Scrub animation horizontally"
        />
      </div>
    </div>
  );
}

export function useScrubReplay(
  animation: Animation,
  scrubRefs: React.MutableRefObject<ScrubRefMap>,
  progressTextRef: React.RefObject<HTMLSpanElement | null>,
  speed: number
) {
  const rafId = useRef<number | null>(null);
  const t0 = useRef(0);
  const animRef = useRef(animation);
  animRef.current = animation;

  const play = useCallback(() => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
    }
    const base = Math.max(220, Math.min(animRef.current.timing.duration, 2000));
    const dur = base / Math.max(0.25, speed);
    animRef.current.scrub(0, scrubRefs.current);
    const s = progressTextRef.current;
    if (s) s.textContent = "0%";
    t0.current = performance.now();
    const frame = (now: number) => {
      const t = (now - t0.current) / dur;
      const p = t >= 1 ? 1 : t;
      animRef.current.scrub(p, scrubRefs.current);
      const span = progressTextRef.current;
      if (span) span.textContent = `${Math.round(p * 100)}%`;
      if (t < 1) {
        rafId.current = requestAnimationFrame(frame);
      } else {
        rafId.current = null;
      }
    };
    rafId.current = requestAnimationFrame(frame);
  }, [progressTextRef, scrubRefs, speed]);

  return play;
}
