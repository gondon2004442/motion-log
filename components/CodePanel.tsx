"use client";

import { useCallback, useEffect, useState } from "react";

type Props = { code: string; className?: string };

export function CodePanel({ code, className = "" }: Props) {
  const [html, setHtml] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setErr(null);
    (async () => {
      try {
        const r = await fetch("/api/highlight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!r.ok) {
          const j = (await r.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error || r.statusText);
        }
        const data = (await r.json()) as { html: string };
        if (alive) setHtml(data.html);
      } catch (e) {
        if (alive) setErr(String((e as Error).message));
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  if (err) {
    return (
      <div className={`relative text-[11px] text-red-400/90 ${className}`}>
        {err}
        <pre className="mt-2 max-h-44 overflow-auto rounded-[10px] border border-line bg-[#0d0d0d] p-3.5 text-[#a0a0a0]">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {html ? (
        <div
          className="code-panel-tweaks max-h-44 overflow-auto rounded-[10px] border border-[#222] p-2.5 text-[11px] leading-relaxed"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="max-h-44 overflow-auto rounded-[10px] border border-line bg-[#0d0d0d] p-3.5 text-[#888]">
          <code className="text-[11px] text-[#666]">…</code>
        </pre>
      )}
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md border border-[#333] px-2.5 py-0.5 text-[10px] font-semibold transition"
        style={{
          background: copied ? "#e8ff47" : "#1e1e1e",
          color: copied ? "#000" : "#888",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
