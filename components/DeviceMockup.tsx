import type { ReactNode } from "react";
import type { DeviceType } from "@/animations/types";

const glass = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 45%), linear-gradient(0deg, #0d0d0d, #141414)",
} as const;

const shadowLg = {
  boxShadow:
    "0 2px 4px rgba(0,0,0,0.35), 0 24px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05) inset",
} as const;

const shadowMb = {
  boxShadow:
    "0 18px 60px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
} as const;

type Props = {
  device: DeviceType;
  children: ReactNode;
  className?: string;
};

export function DeviceMockup({ device, children, className = "" }: Props) {
  if (device === "macbook") {
    return <MacbookShell className={className}>{children}</MacbookShell>;
  }
  if (device === "android") {
    return <AndroidShell className={className}>{children}</AndroidShell>;
  }
  return <IPhone15Shell className={className}>{children}</IPhone15Shell>;
}

function IPhone15Shell({ children, className }: { children: ReactNode; className: string }) {
  const w = 196;
  const h = 396;
  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: w, height: h, ...shadowLg }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: 44,
          ...glass,
        }}
      />
      <svg
        className="absolute left-0 top-0 h-full w-full"
        viewBox="0 0 196 396"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g15" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="192" height="392" rx="40" fill="url(#g15)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <rect x="58" y="10" width="80" height="10" rx="5" fill="#0a0a0a" />
        <rect x="64" y="12" width="20" height="6" rx="2" fill="#0f0f0f" opacity="0.75" />
      </svg>
      <div
        className="absolute overflow-hidden"
        style={{
          left: 8,
          top: 20,
          width: 180,
          height: 360,
          borderRadius: 36,
          background: "#0a0a0a",
          boxShadow: "0 0 0 0.5px rgba(0,0,0,0.4), inset 0 0 24px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 z-20 h-6 w-full"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.2), transparent 90%)",
          }}
        />
        <div className="flex h-full w-full min-h-0 min-w-0 flex-col">
          {children}
        </div>
      </div>
      <div
        className="absolute bottom-1 left-1/2 z-20 h-1.5 w-9 -translate-x-1/2"
        style={{
          background: "rgba(255,255,255,0.14)",
          borderRadius: 6,
          boxShadow: "0 0 0 0.5px rgba(0,0,0,0.3)",
        }}
        aria-hidden
      />
    </div>
  );
}

function AndroidShell({ children, className }: { children: ReactNode; className: string }) {
  const w = 198;
  const h = 402;
  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: w, height: h, ...shadowLg }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: 28, ...glass }}
      />
      <svg className="absolute h-full w-full" viewBox="0 0 198 402" fill="none" aria-hidden>
        <rect
          x="1.5"
          y="1.5"
          width="195"
          height="399"
          rx="32"
          stroke="rgba(255,255,255,0.05)"
        />
        <rect x="82" y="8" width="10" height="10" rx="2" fill="#0c0c0c" />
        <circle cx="90" cy="12" r="1.1" fill="#0f8cff" fillOpacity="0.45" />
      </svg>
      <div
        className="absolute overflow-hidden"
        style={{
          left: 6,
          top: 20,
          width: 186,
          height: 370,
          borderRadius: 22,
          background: "#0a0a0a",
          boxShadow: "inset 0 0 18px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex h-full w-full min-h-0 min-w-0 flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

function MacbookShell({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div className={`mx-auto flex flex-col items-center ${className}`}>
      <div
        className="overflow-hidden"
        style={{
          width: 456,
          height: 300,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          ...shadowMb,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, #141414 35%, #0a0a0a 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex h-7 items-center border-b pl-2.5"
          style={{
            background: "linear-gradient(0deg, #1e1e1e, #2a2a2a)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} className="h-2 w-2 rounded-full" style={{ background: c, margin: "0 2px" }} />
          ))}
          <div
            className="ml-2.5 h-1.5 flex-1 rounded"
            style={{ background: "rgba(0,0,0,0.25)" }}
          />
        </div>
        <div
          className="relative h-full w-full min-h-0 min-w-0"
          style={{ height: "calc(100% - 1.75rem)" }}
        >
          <div
            className="pointer-events-none absolute right-0 top-0 z-20 h-24 w-24"
            style={{
              background: "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.1), transparent 60%)",
            }}
          />
          {children}
        </div>
      </div>
      <div
        className="h-3 w-[110px] rounded-b-md"
        style={{ background: "#0f0f0f", boxShadow: "0 3px 10px rgba(0,0,0,0.4)" }}
      />
      <div
        className="mt-1.5 h-1.5 w-[200px] rounded"
        style={{
          background: "linear-gradient(0deg, #0c0c0c, #181818)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 6px 18px -4px rgba(232,255,71,0.1)",
        }}
      />
    </div>
  );
}
