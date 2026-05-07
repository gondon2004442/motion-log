import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Dark "modal" interior */
  dark?: boolean;
  className?: string;
};

/**
 * In-device content chrome (bezel inner area) — same proportions as the original monolith.
 */
export function PhoneUI({ children, dark, className = "" }: Props) {
  return (
    <div
      className={`box-border flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden ${className}`}
      style={{
        background: dark ? "#111" : "#f5f5f5",
        borderRadius: 6,
        padding: "10px 12px",
      }}
    >
      {children}
    </div>
  );
}
