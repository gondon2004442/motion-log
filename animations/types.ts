export type DeviceType = "iphone" | "android" | "macbook";

export type AnimationCategory =
  | "Transitions"
  | "Micro"
  | "Loading"
  | "Scroll";

export type ScrubRefMap = Record<string, HTMLElement | null | unknown>;

export type Animation = {
  id: string;
  name: string;
  category: AnimationCategory;
  description: string;
  css: string;
  timing: { duration: number; easing: string };
  /**
   * Imperative DOM updates from scrub progress 0-1. No React re-renders in caller.
   */
  scrub: (p: number, refs: ScrubRefMap) => void;
  /** Keys required for this animation's scene (for documentation / dev) */
  refKeys: string[];
};
