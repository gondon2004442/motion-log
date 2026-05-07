import { clamp, easeCubic, lerp, throughEase } from "@/lib/math";
import type { Animation, ScrubRefMap } from "./types";

function e016(t: number) {
  return easeCubic(t, 0.16, 1, 0.3, 1);
}

const scrubSlideUp: Animation["scrub"] = (p, refs) => {
  for (let i = 0; i < 3; i++) {
    const el = refs[`card${i}`] as HTMLElement | null;
    if (!el) continue;
    const t0 = clamp(p * 1.28 - i * 0.22, 0, 1);
    const te = e016(t0);
    el.style.transition = "none";
    el.style.transform = `translateY(${(1 - te) * 48}px)`;
    el.style.opacity = String(te);
  }
};

const scrubScalePop: Animation["scrub"] = (p, refs) => {
  for (let i = 0; i < 3; i++) {
    const el = refs[`pop${i}`] as HTMLElement | null;
    if (!el) continue;
    const local = clamp(p * 3.2 - i, 0, 1);
    // bounce toward 1: 0-0.15 down, 15-1 up past 1 then settle
    let s = 1;
    if (local <= 0) s = 1;
    else if (local < 0.2) s = lerp(1, 0.8, local / 0.2);
    else {
      const w = (local - 0.2) / 0.8;
      s = 0.8 + 0.2 * w + 0.08 * Math.sin(w * Math.PI);
    }
    el.style.transform = `scale(${s})`;
  }
};

const scrubFadeBlur: Animation["scrub"] = (p, refs) => {
  const el = refs.card as HTMLElement | null;
  if (!el) return;
  const te = throughEase(p, "ease");
  el.style.opacity = String(te);
  el.style.filter = `blur(${(1 - te) * 10}px)`;
  el.style.transform = `scale(${0.96 + 0.04 * te})`;
};

const scrubSkeleton: Animation["scrub"] = (p, refs) => {
  const el = refs.sk as HTMLElement | null;
  if (!el) return;
  const u = p % 1;
  el.style.backgroundPosition = `${lerp(0, 200, u)}% 0`;
  el.style.transition = "none";
};

const scrubBottomSheet: Animation["scrub"] = (p, refs) => {
  const sheet = refs.sheet as HTMLElement | null;
  const over = refs.overlay as HTMLElement | null;
  if (sheet) {
    const t = e016(p);
    sheet.style.transform = `translateY(${(1 - t) * 100}%)`;
  }
  if (over) {
    const t = e016(p);
    over.style.background = `rgba(0,0,0,${0.5 * t})`;
  }
};

const scrubStagger: Animation["scrub"] = (p, refs) => {
  for (let i = 0; i < 4; i++) {
    const el = refs[`item${i}`] as HTMLElement | null;
    if (!el) continue;
    const t0 = clamp(p * 1.35 - i * 0.12, 0, 1);
    const te = e016(t0);
    el.style.transform = `translateX(${(1 - te) * -18}px)`;
    el.style.opacity = String(te);
  }
};

const scrubFlip: Animation["scrub"] = (p, refs) => {
  const root = refs.flipRoot as HTMLElement | null;
  if (!root) return;
  root.style.transform = `translateZ(-1px) rotateY(${p * 180}deg)`;
  root.style.transformStyle = "preserve-3d";
};

const scrubZoomCenter: Animation["scrub"] = (p, refs) => {
  const el = refs.zoom as HTMLElement | null;
  if (!el) return;
  const t = e016(p);
  el.style.opacity = String(t);
  el.style.transform = `scale(${0.4 + 0.6 * t})`;
};

const scrubCrossfade: Animation["scrub"] = (p, refs) => {
  const a = refs.cfa as HTMLElement | null;
  const b = refs.cfb as HTMLElement | null;
  if (a) a.style.opacity = String(1 - p);
  if (b) b.style.opacity = String(p);
};

const scrubRipple: Animation["scrub"] = (p, refs) => {
  const r = refs.rip as HTMLElement | null;
  if (!r) return;
  r.style.transform = `scale(${0.2 + p * 2.2})`;
  r.style.opacity = String(Math.max(0, 1 - p * 0.9));
};

const scrubToggle: Animation["scrub"] = (p, refs) => {
  const tr = refs.track as HTMLElement | null;
  const th = refs.thumb as HTMLElement | null;
  if (th) th.style.left = `${4 + p * 20}px`;
  if (tr) {
    tr.style.background = p > 0.5 ? "rgba(232,255,71,0.35)" : "#2a2a2a";
  }
};

const scrubLike: Animation["scrub"] = (p, refs) => {
  const h = refs.heart as HTMLElement | null;
  if (h) h.style.transform = `scale(${1 + 0.2 * Math.sin(p * Math.PI)})`;
  for (let i = 0; i < 6; i++) {
    const pt = refs[`pt${i}`] as HTMLElement | null;
    if (!pt) continue;
    const ang = (i / 6) * Math.PI * 2;
    const d = 36 * p;
    pt.style.opacity = String(Math.max(0, 0.8 - p * 1.2));
    pt.style.transform = `translate(${Math.cos(ang) * d}px, ${
      Math.sin(ang) * d
    }px) scale(${0.5 + 0.5 * (1 - p)})`;
  }
};

const scrubProgress: Animation["scrub"] = (p, refs) => {
  const f = refs.fill as HTMLElement | null;
  if (f) f.style.width = `${p * 100}%`;
};

const scrubTyping: Animation["scrub"] = (p, refs) => {
  for (let i = 0; i < 3; i++) {
    const d = refs[`d${i}`] as HTMLElement | null;
    if (!d) continue;
    const phase = (p * 5 + i * 0.2) * Math.PI * 2;
    const off = (Math.sin(phase) * 0.5 + 0.5) * 8;
    d.style.transform = `translateY(-${off}px) scale(1, ${1 + 0.15 * Math.sin(phase)})`;
  }
};

const scrubSpinner: Animation["scrub"] = (p, refs) => {
  const s = refs.spin as HTMLElement | null;
  if (s) s.style.transform = `rotate(${p * 720}deg)`;
};

const scrubParallax: Animation["scrub"] = (p, refs) => {
  const back = refs.plxBack as HTMLElement | null;
  const fore = refs.plxFore as HTMLElement | null;
  if (back) back.style.transform = `translateY(${p * 28}px)`;
  if (fore) fore.style.transform = `translateY(${-p * 12}px)`;
  if (fore) fore.style.opacity = String(0.35 + 0.65 * p);
};

const scrubSticky: Animation["scrub"] = (p, refs) => {
  const head = refs.stkHead as HTMLElement | null;
  if (!head) return;
  const h = lerp(56, 40, p);
  const fs = lerp(15, 12, p);
  const padY = lerp(14, 6, p);
  head.style.height = `${h}px`;
  head.style.fontSize = `${fs}px`;
  head.style.paddingTop = `${padY}px`;
  head.style.paddingBottom = `${padY}px`;
};

export const animations: Animation[] = [
  {
    id: "slide-up",
    name: "Slide Up",
    category: "Transitions",
    description: "Element enters from bottom with spring easing",
    refKeys: ["card0", "card1", "card2"],
    timing: { duration: 520, easing: "cubic-bezier(0.16,1,0.3,1)" },
    css: `@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.el { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }`,
    scrub: scrubSlideUp,
  },
  {
    id: "scale-pop",
    name: "Scale Pop",
    category: "Micro",
    description: "Satisfying pop effect for buttons and icons",
    refKeys: ["pop0", "pop1", "pop2"],
    timing: { duration: 400, easing: "cubic-bezier(0.34,1.56,0.64,1)" },
    css: `@keyframes scalePop {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.92); }
  100% { transform: scale(1.06); }
}
.btn:active { animation: scalePop 0.3s ease forwards; }`,
    scrub: scrubScalePop,
  },
  {
    id: "fade-blur",
    name: "Fade + Blur",
    category: "Transitions",
    description: "Cinematic blur-in reveal for modals and overlays",
    refKeys: ["card"],
    timing: { duration: 450, easing: "ease" },
    css: `@keyframes fadeBlur {
  from { opacity: 0; filter: blur(12px); transform: scale(0.97); }
  to   { opacity: 1; filter: blur(0px);  transform: scale(1); }
}
.modal { animation: fadeBlur 0.4s ease forwards; }`,
    scrub: scrubFadeBlur,
  },
  {
    id: "skeleton",
    name: "Skeleton Load",
    category: "Loading",
    description: "Shimmer skeleton for content placeholders",
    refKeys: ["sk"],
    timing: { duration: 1400, easing: "linear" },
    css: `@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg,#2a2a2a 25%,#3a3a3a 50%,#2a2a2a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}`,
    scrub: scrubSkeleton,
  },
  {
    id: "bottom-sheet",
    name: "Bottom Sheet",
    category: "Transitions",
    description: "Native-feel bottom sheet slide-up",
    refKeys: ["sheet", "overlay"],
    timing: { duration: 450, easing: "cubic-bezier(0.16,1,0.3,1)" },
    css: `@keyframes sheetUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
.sheet { animation: sheetUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }`,
    scrub: scrubBottomSheet,
  },
  {
    id: "stagger-list",
    name: "Stagger List",
    category: "Transitions",
    description: "List items cascade in with staggered delay",
    refKeys: ["item0", "item1", "item2", "item3"],
    timing: { duration: 380, easing: "ease" },
    css: `@keyframes staggerIn {
  from { transform: translateX(-20px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.item { animation: staggerIn 0.4s ease forwards; }`,
    scrub: scrubStagger,
  },
  {
    id: "flip-card",
    name: "Flip Card",
    category: "Transitions",
    description: "3D flip between front and back of a card",
    refKeys: ["flipRoot"],
    timing: { duration: 600, easing: "cubic-bezier(0.4,0,0.2,1)" },
    css: `.stage { perspective: 800px; }
.face { backface-visibility: hidden; }
.flipped { transform: rotateY(180deg); }`,
    scrub: scrubFlip,
  },
  {
    id: "zoom-center",
    name: "Zoom from Center",
    category: "Transitions",
    description: "Scale and fade in from the viewport center",
    refKeys: ["zoom"],
    timing: { duration: 480, easing: "cubic-bezier(0.16,1,0.3,1)" },
    css: `@keyframes zoomIn {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}`,
    scrub: scrubZoomCenter,
  },
  {
    id: "crossfade",
    name: "Crossfade",
    category: "Transitions",
    description: "Two layers crossfade in place",
    refKeys: ["cfa", "cfb"],
    timing: { duration: 500, easing: "ease" },
    css: `.a { opacity: 1; } .b { opacity: 0; } /* use scrub */`,
    scrub: scrubCrossfade,
  },
  {
    id: "ripple-tap",
    name: "Ripple Tap",
    category: "Micro",
    description: "Material-style radial ripple on press",
    refKeys: ["rip"],
    timing: { duration: 450, easing: "ease" },
    css: `.ripple { border-radius: 50%; }`,
    scrub: scrubRipple,
  },
  {
    id: "toggle-switch",
    name: "Toggle Switch",
    category: "Micro",
    description: "Thumb glides and track fills on toggle",
    refKeys: ["track", "thumb"],
    timing: { duration: 200, easing: "ease" },
    css: `.track { } .thumb { }`,
    scrub: scrubToggle,
  },
  {
    id: "like-heart",
    name: "Like · Heart Burst",
    category: "Micro",
    description: "Burst particles around a heart on like",
    refKeys: ["heart", "pt0", "pt1", "pt2", "pt3", "pt4", "pt5"],
    timing: { duration: 500, easing: "ease" },
    css: `.heart { } .p { }`,
    scrub: scrubLike,
  },
  {
    id: "progress-bar",
    name: "Progress Bar",
    category: "Loading",
    description: "Linear progress fill 0% → 100%",
    refKeys: ["fill"],
    timing: { duration: 2000, easing: "linear" },
    css: `.bar { overflow: hidden; } .bar > i { display:block; }`,
    scrub: scrubProgress,
  },
  {
    id: "typing-dots",
    name: "Typing Dots",
    category: "Loading",
    description: "Bouncing three-dot typing indicator",
    refKeys: ["d0", "d1", "d2"],
    timing: { duration: 1000, easing: "linear" },
    css: `/* dots */`,
    scrub: scrubTyping,
  },
  {
    id: "circular-spinner",
    name: "Circular Spinner",
    category: "Loading",
    description: "Rotating stroke ring",
    refKeys: ["spin"],
    timing: { duration: 1200, easing: "linear" },
    css: `@keyframes rot { to { transform: rotate(360deg); } }`,
    scrub: scrubSpinner,
  },
  {
    id: "parallax-reveal",
    name: "Parallax Reveal",
    category: "Scroll",
    description: "Background and foreground move at different rates",
    refKeys: ["plxBack", "plxFore"],
    timing: { duration: 800, easing: "linear" },
    css: `/* scroll-linked with scrub */`,
    scrub: scrubParallax,
  },
  {
    id: "sticky-header-shrink",
    name: "Sticky Header Shrink",
    category: "Scroll",
    description: "Header compacts and title scales on scroll",
    refKeys: ["stkHead"],
    timing: { duration: 700, easing: "ease" },
    css: `/* sticky with scrub as scroll proxy */`,
    scrub: scrubSticky,
  },
];

export function getAnimationById(id: string): Animation | undefined {
  return animations.find((a) => a.id === id);
}

export const DEFAULT_ANIMATION_ID = animations[0]!.id;
