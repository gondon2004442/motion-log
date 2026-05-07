import { create } from "zustand";
import type { DeviceType } from "@/animations/types";

export type CategoryFilter = "All" | "Transitions" | "Micro" | "Loading" | "Scroll";

type AppState = {
  device: DeviceType;
  category: CategoryFilter;
  searchQuery: string;
  selectedAnimationId: string;
  setDevice: (d: DeviceType) => void;
  setCategory: (c: CategoryFilter) => void;
  setSearchQuery: (q: string) => void;
  setSelectedAnimationId: (id: string) => void;
  lastScrubProgress: number;
  setLastScrubProgress: (p: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  device: "iphone",
  category: "All",
  searchQuery: "",
  selectedAnimationId: "",
  setDevice: (d) => set({ device: d }),
  setCategory: (c) => set({ category: c }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedAnimationId: (id) => set({ selectedAnimationId: id }),
  lastScrubProgress: 0,
  setLastScrubProgress: (p) => set({ lastScrubProgress: p }),
}));
