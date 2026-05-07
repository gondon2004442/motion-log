import { ImageResponse } from "next/og";
import { getAnimationById } from "@/animations";

export const runtime = "edge";
export const alt = "animpreview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage({ params }: { params: { id: string } }) {
  const a = getAnimationById(params.id);
  const name = a?.name ?? "animpreview";
  const sub = a?.category
    ? `${a.category} · ${a.id}`
    : "ui motion reference";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #0a0a0a, #0f1008)",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(232,255,71,0.12), transparent 55%)",
          }}
        />
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "#e8ff47",
            marginBottom: 20,
            boxShadow: "0 18px 60px rgba(232,255,71,0.18)",
          }}
        />
        <div
          style={{
            color: "#e0e0e0",
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: -2,
            marginTop: 8,
          }}
        >
          {name}
        </div>
        <div
          style={{
            color: "#6a6a6a",
            fontSize: 22,
            marginTop: 12,
            fontWeight: 500,
          }}
        >
          {sub}
        </div>
        <div
          style={{
            color: "#e8ff47",
            fontSize: 20,
            marginTop: 28,
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          animpreview
        </div>
      </div>
    ),
    { ...size }
  );
}
