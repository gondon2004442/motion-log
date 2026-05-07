import fs from "node:fs";
import path from "node:path";
import IosVideoGallery from "@/components/ios/IosVideoGallery";

type VideoItem = {
  id: string;
  name: string;
  src: string;
  title: string;
  os: "iOS" | "Android";
  tags: string[];
  categorySlug: string;
};

type VideoCategory = {
  slug: string;
  label: string;
  os: "iOS" | "Android";
  videos: VideoItem[];
};

const EXTS = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"]);
const PRIORITY_ORDER = [
  "Control_Center.mp4",
  "Add_widget.mp4",
  "Flashlight.mp4",
  "Control_center_switch.mp4",
];

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "video";
}

function toTitle(name: string): string {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/(\d)([A-Za-zА-Яа-я])/g, "$1 $2")
    .replace(/([a-zа-я])([A-ZА-Я])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldIgnoreName(name: string): boolean {
  return (
    name.startsWith("._") ||
    name === ".DS_Store" ||
    name.endsWith(".DS_Store") ||
    name.endsWith("DS_Store")
  );
}

function categoryOs(slugName: string): "iOS" | "Android" {
  return slugName.toLowerCase().includes("android") ? "Android" : "iOS";
}

function categoryLabel(slugName: string): string {
  const cleaned = slugName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Unsorted";
  return cleaned.replace(/\b\w/g, (s) => s.toUpperCase());
}

function parseCategoryFolder(raw: string): { order: number; label: string; slug: string } {
  const m = raw.match(/^(\d+)[\s_-]*(.*)$/);
  const order = m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
  const tail = (m?.[2] || raw).trim();
  const spaced = tail
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const normalized = spaced.toLowerCase();
  const figmaMap: Record<string, string> = {
    ios: "iOS",
    android: "Android",
    transition: "Transition",
    "splash screen": "Splash screen",
    onboarding: "Onboarding",
    camera: "Camera",
    microinteraction: "Micro interaction",
    micro: "Micro interaction",
    player: "Player",
    menu: "Menu",
    promo: "Promo",
    navigation: "Navigation",
    "social interaction": "Social interaction",
    loading: "Loading",
  };
  const label =
    figmaMap[normalized] ||
    (spaced ? spaced.replace(/\b\w/g, (s) => s.toUpperCase()) : categoryLabel(raw));
  return { order, label, slug: slug(label) };
}

function readCategories(): VideoCategory[] {
  const cwd = process.cwd();
  const fromPublic = path.join(cwd, "public", "animations");
  const fromIncoming = path.join(fromPublic, "incoming_1_13");
  if (!fs.existsSync(fromPublic)) return [];

  const categories: VideoCategory[] = [];
  const sourceRoot = fs.existsSync(fromIncoming) ? fromIncoming : fromPublic;
  const entries = fs.readdirSync(sourceRoot, { withFileTypes: true });
  const categoryDirs = entries.filter((entry) => entry.isDirectory());

  const readNestedVideos = (
    dirAbs: string,
    categorySlug: string,
    categoryDisplay: string,
    os: "iOS" | "Android",
    relative = ""
  ) => {
    const videos: VideoItem[] = [];
    const files = fs.readdirSync(dirAbs, { withFileTypes: true });
    for (const file of files) {
      if (shouldIgnoreName(file.name)) continue;
      const fileAbs = path.join(dirAbs, file.name);
      const nestedRel = relative ? `${relative}/${file.name}` : file.name;
      if (file.isDirectory()) {
        videos.push(...readNestedVideos(fileAbs, categorySlug, categoryDisplay, os, nestedRel));
        continue;
      }
      if (!file.isFile()) continue;
      const ext = path.extname(file.name).toLowerCase();
      if (!EXTS.has(ext)) continue;
      const rel = `${path.basename(sourceRoot)}/${categoryDisplay}/${nestedRel}`;
      const encoded = rel.split("/").map(encodeURIComponent).join("/");
      const title = toTitle(file.name);
      videos.push({
        id: slug(`${categorySlug}-${nestedRel}`),
        name: file.name,
        src: `/animations/${encoded}`,
        title,
        os,
        tags: [categoryLabel(categoryDisplay)],
        categorySlug,
      });
    }
    return videos;
  };

  const rawCollected: Array<VideoCategory & { order: number }> = [];
  for (const dir of categoryDirs) {
    const parsed = parseCategoryFolder(dir.name);
    const os = categoryOs(parsed.label);
    const videos = readNestedVideos(
      path.join(sourceRoot, dir.name),
      parsed.slug,
      dir.name,
      os
    );
    if (!videos.length) continue;
    rawCollected.push({
      slug: parsed.slug,
      label: parsed.label,
      os,
      order: parsed.order,
      videos: videos.sort((a, b) => a.title.localeCompare(b.title, "ru")),
    });
  }

  categories.push(
    ...rawCollected.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.label.localeCompare(b.label, "ru");
    })
  );

  return categories;
}

export default function Home() {
  const categories = readCategories();
  return <IosVideoGallery categories={categories} />;
}
