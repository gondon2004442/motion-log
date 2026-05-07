import { getHighlighter, type Highlighter } from "shiki";
import { NextResponse } from "next/server";

let highlighter: Highlighter | null = null;

async function getH(): Promise<Highlighter> {
  if (highlighter) return highlighter;
  highlighter = await getHighlighter({
    themes: ["github-dark"],
    langs: ["css"],
  });
  return highlighter;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const code = typeof body === "object" && body && "code" in body ? (body as { code: unknown }).code : null;
    if (typeof code !== "string") {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
    const h = await getH();
    const html = h.codeToHtml(code, { lang: "css", theme: "github-dark" });
    return NextResponse.json({ html });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Highlight failed" },
      { status: 500 }
    );
  }
}
