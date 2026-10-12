"use client";

import { useMemo, useState } from "react";
import { renderMarkdown, wordCount } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type Props = { name: string; defaultValue?: string; label?: string; rows?: number };

/**
 * Markdown editor with a live preview using the site's prose styles.
 * Plain textarea underneath, so it works without JavaScript too.
 */
export default function MarkdownEditor({ name, defaultValue = "", label = "Content", rows = 22 }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"write" | "preview" | "split">("write");
  const html = useMemo(() => (mode === "write" ? "" : renderMarkdown(value)), [value, mode]);
  const words = wordCount(value);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="t-mono text-mute">
          {label} · Markdown · {words} words · {Math.max(1, Math.round(words / 200))} min
        </span>
        <div className="flex border border-line">
          {(["write", "split", "preview"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn("t-mono px-3 py-1.5 transition-colors", mode === m ? "bg-fg text-bg" : "text-mute hover:text-fg")}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className={cn("grid gap-3", mode === "split" && "lg:grid-cols-2")}>
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          spellCheck
          className={cn("admin-input resize-y font-mono text-[13px] leading-relaxed", mode === "preview" && "hidden")}
          placeholder={"## Heading\n\nParagraph text. **Bold**, *italic*, [links](https://example.com).\n\n> A pulled quote\n\n1. Numbered list\n2. Second item"}
        />
        {mode !== "write" && (
          <div className="min-h-[10rem] overflow-auto border border-line bg-panel p-6">
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
      <p className="text-[12px] text-mute">
        Headings with <code className="font-mono">##</code>, quotes with <code className="font-mono">&gt;</code>, notes as <code className="font-mono">&gt; **Note:** text</code>. Images: <code className="font-mono">![alt](https://url)</code>.
      </p>
    </div>
  );
}
