import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".m4v": "video/x-m4v",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
};

export async function GET(
  _req: Request,
  { params }: { params: { name: string[] } }
) {
  const raw = decodeURIComponent((params.name || []).join("/"));
  const base = path.join(process.cwd(), "анимации");
  const abs = path.join(base, raw);

  if (!abs.startsWith(base)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const data = await fs.readFile(abs);
    const ext = path.extname(abs).toLowerCase();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "content-type": MIME[ext] || "application/octet-stream",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}