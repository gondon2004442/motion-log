"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

type Props = {
  categories: VideoCategory[];
};

const THEME_KEY = "motion-log-theme";
type Theme = "dark" | "light";
const SCRUB_SEEK_INTERVAL_MS = 16; // ~60fps update ceiling
const SCRUB_EASING = 0.14;
const SCRUB_SNAP_PROGRESS = 0.0015;
const SCRUB_MIN_SEEK_DELTA_SEC = 1 / 240;
const FIGMA_CATEGORY_ORDER = [
  "Micro interaction",
  "Navigation",
  "Transition",
  "Morphing",
  "Loading",
  "Appear",
  "Splash screen",
  "Promo",
] as const;

function HoverScrubVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const lastSeekAtRef = useRef(0);
  const lastAppliedTimeRef = useRef(0);

  const stopLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const flushSeek = (now: number) => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;

    const diffProgress = targetProgressRef.current - smoothProgressRef.current;
    if (Math.abs(diffProgress) < SCRUB_SNAP_PROGRESS) {
      smoothProgressRef.current = targetProgressRef.current;
    } else {
      smoothProgressRef.current += diffProgress * SCRUB_EASING;
    }

    if (now - lastSeekAtRef.current < SCRUB_SEEK_INTERVAL_MS) {
      rafRef.current = requestAnimationFrame(flushSeek);
      return;
    }

    const targetTime = smoothProgressRef.current * el.duration;
    if (Math.abs(targetTime - lastAppliedTimeRef.current) >= SCRUB_MIN_SEEK_DELTA_SEC) {
      el.currentTime = targetTime;
      lastAppliedTimeRef.current = targetTime;
    }
    lastSeekAtRef.current = now;

    if (
      isHoveringRef.current ||
      Math.abs(targetProgressRef.current - smoothProgressRef.current) > SCRUB_SNAP_PROGRESS
    ) {
      rafRef.current = requestAnimationFrame(flushSeek);
    } else {
      stopLoop();
    }
  };

  const seekToProgress = (host: HTMLElement, clientX: number) => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    const rect = host.getBoundingClientRect();
    if (rect.width <= 0) return;

    targetProgressRef.current = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(flushSeek);
    }
  };

  useEffect(() => stopLoop, []);

  return (
    <div
      className="ios-video-hitbox"
      onPointerEnter={() => {
        isHoveringRef.current = true;
        const el = videoRef.current;
        if (!el) return;
        // Warm-up only active video to avoid decoding all tracks at once.
        el.play().then(() => el.pause()).catch(() => {});
      }}
      onPointerMove={(e) => {
        seekToProgress(e.currentTarget, e.clientX);
      }}
      onPointerDown={(e) => {
        seekToProgress(e.currentTarget, e.clientX);
      }}
      onPointerLeave={() => {
        isHoveringRef.current = false;
      }}
    >
      <video
        ref={videoRef}
        className="ios-video"
        src={src}
        muted
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          el.currentTime = 0;
          targetProgressRef.current = 0;
          smoothProgressRef.current = 0;
          lastAppliedTimeRef.current = 0;
        }}
      />
    </div>
  );
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function Brand({ theme }: { theme: Theme }) {
  const logoSrc =
    theme === "dark"
      ? "/logo/motionlog_logo_dark.svg"
      : "/logo/motionlog_logo_light.svg";
  return (
    <div className="ml-brand">
      <img className="ml-brand-image" src={logoSrc} alt="Motion Log" />
    </div>
  );
}

function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title, ""];
  const middle = Math.ceil(words.length * 0.56);
  return [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
}

export default function IosVideoGallery({ categories }: Props) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [showInfo, setShowInfo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("micro-interaction");
  const [activeVideoId, setActiveVideoId] = useState<string>(
    categories[0]?.videos[0]?.id ?? ""
  );
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const menu = useMemo(() => {
    const normalize = (v: string) => v.toLowerCase().replace(/[^a-z]/g, "");
    const byLabel = new Map(
      categories.map((c) => [normalize(c.label), c] as const)
    );
    const iosFallback =
      byLabel.get("ios") ||
      byLabel.get("transition") ||
      categories[0];

    return FIGMA_CATEGORY_ORDER.map((label) => {
      const key = normalize(label);
      const match = byLabel.get(key);
      if (match) {
        return { slug: match.slug, label, videos: match.videos };
      }
      if (label === "Micro interaction" && iosFallback) {
        return { slug: "micro-interaction", label, videos: iosFallback.videos };
      }
      return { slug: key, label, videos: [] };
    });
  }, [categories]);

  useEffect(() => {
    if (!menu.length) return;
    if (!menu.some((m) => m.slug === selectedCategory)) {
      setSelectedCategory(menu[0].slug);
    }
  }, [menu, selectedCategory]);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const currentCategory = useMemo(() => {
    return menu.find((cat) => cat.slug === selectedCategory) ?? menu[0];
  }, [menu, selectedCategory]);

  const videos = currentCategory?.videos ?? [];
  const activeVideo = videos.find((v) => v.id === activeVideoId) ?? videos[0];
  const [titleTop, titleBottom] = splitTitle(activeVideo?.title ?? "iOS Calendar Transition");

  useEffect(() => {
    if (!videos.length) {
      setActiveVideoId("");
      return;
    }
    if (!videos.some((v) => v.id === activeVideoId)) {
      setActiveVideoId(videos[0].id);
    }
  }, [videos, activeVideoId]);

  useEffect(() => {
    if (!videos.length) return;
    // Keep only active card warm to reduce decoder pressure.
    for (const v of videos) {
      const wrap = refs.current[v.id];
      if (!wrap) continue;
      const el = wrap.querySelector("video") as HTMLVideoElement | null;
      if (!el) continue;
      if (v.id === activeVideoId) {
        el.preload = "auto";
      } else {
        el.pause();
        el.preload = "metadata";
      }
    }
  }, [videos, activeVideoId]);

  useEffect(() => {
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const id = visible[0].target.getAttribute("data-video-id");
        if (id) setActiveVideoId(id);
      },
      { rootMargin: "-28% 0px -42% 0px", threshold: [0.2, 0.45, 0.7] }
    );

    for (const v of videos) {
      const el = refs.current[v.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [videos]);

  return (
    <div className="ml-page">
      <header className="ml-header">
        <Brand theme={theme} />
        <button className="ml-info-btn" onClick={() => setShowInfo(true)}>
          Info
        </button>
      </header>

      <main className="ml-layout">
        <aside className="ml-sidebar">
          <nav className="ml-categories">
            {menu.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={`ml-category-item ${
                  category.slug === selectedCategory ? "is-active" : ""
                }`}
                onClick={() => setSelectedCategory(category.slug)}
              >
                <span className="ml-category-caret">▸</span>
                <span>{category.label}</span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="ml-theme-toggle"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  className="ml-theme-icon-moon"
                  d="M17.5 13.5a7 7 0 1 1-7-7c.4 0 .8 0 1.1.1A6 6 0 0 0 17.5 13.5z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.1M12 19.4v2.1M2.5 12h2.1M19.4 12h2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />
              </svg>
            )}
          </button>
        </aside>

        <section className="ml-feed">
          {videos.length === 0 ? (
            <section className="ios-empty">
              <h1>No videos found</h1>
              <p>
                Add files into
                <code> animpreview/public/animations/{selectedCategory}</code>.
              </p>
            </section>
          ) : (
            videos.map((v) => (
              <article
                key={v.id}
                className="ml-scene"
                data-video-id={v.id}
                ref={(node) => {
                  refs.current[v.id] = node;
                }}
              >
                <div className="iphone-shell">
                  <div className="iphone-notch" />
                  <HoverScrubVideo src={v.src} />
                  <div className="iphone-home" />
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="ml-meta">
          {activeVideo ? (
            <>
              <h2>
                {titleTop}
                <br />
                {titleBottom || ""}
              </h2>
              <p>
                {activeVideo.os}
                {currentCategory?.label ? `, ${currentCategory.label}` : ""}
              </p>
            </>
          ) : (
            <div className="ios-empty">
              <h1>No videos found</h1>
              <p>
                Add files into <code>animpreview/public/animations</code> or <code>animpreview/анимации</code>.
              </p>
            </div>
          )}
        </aside>
      </main>

      {showInfo ? (
        <div className="ml-modal-backdrop" onClick={() => setShowInfo(false)}>
          <section className="ml-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Motion Log</h3>
            <p>Catalog of UI animation references for product design and frontend implementation.</p>
            <p>Use category list on the left and scrub videos by moving cursor over the screen.</p>
            <button className="ml-modal-close" onClick={() => setShowInfo(false)}>
              Close
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
