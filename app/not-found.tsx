import Link from "next/link";
import { DEFAULT_ANIMATION_ID } from "@/animations";

export default function NotFound() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-void p-4 text-center"
    >
      <h1 className="text-2xl font-bold text-white">Not found</h1>
      <p className="text-sm" style={{ color: "#666" }}>
        This animation or page does not exist.
      </p>
      <Link
        href={`/animations/${DEFAULT_ANIMATION_ID}`}
        className="text-sm font-medium text-[#e8ff47] underline"
      >
        Open gallery
      </Link>
    </div>
  );
}
