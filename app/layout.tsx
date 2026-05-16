import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Figma: PP Pangaia Light / Ultralight for display titles (only Light file is bundled). */
const pangaia = localFont({
  src: "../font/PPPangaia-Light.woff2",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "animpreview", template: "%s · animpreview" },
  description:
    "Interactive UI motion gallery. Scrub, replay, and copy CSS for transitions, micro, loading, and scroll-inspired animations.",
  openGraph: {
    type: "website",
    siteName: "animpreview",
    title: "animpreview",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={pangaia.variable} data-theme="dark">
      <body className="min-h-dvh bg-void font-sans text-[#e0e0e0] antialiased">
        {children}
      </body>
    </html>
  );
}
