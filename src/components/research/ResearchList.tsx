"use client";

import { useMemo, useState } from "react";
import ResearchCard, { type ResearchItem } from "./ResearchCard";
import { cn } from "@/lib/utils";

/** Research index with category filtering. Only categories that have published work are shown. */
export default function ResearchList({ articles }: { articles: ResearchItem[] }) {
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of articles) if (a.category) m.set(a.category, (m.get(a.category) ?? 0) + 1);
    return [...m.entries()];
  }, [articles]);

  const visible = filter === "All" ? articles : articles.filter((a) => a.category === filter);

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[["All", articles.length] as const, ...categories].map(([c, n]) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn(
                "rounded-none border px-4 py-2 text-[14px] font-medium transition-colors duration-200",
                filter === c ? "border-fg bg-fg text-bg" : "border-line-strong text-fg hover:border-fg",
              )}
            >
              {c} <span className={cn("ml-1 tabular", filter === c ? "text-bg/70" : "text-mute")}>{n}</span>
            </button>
          ))}
        </div>
      )}
      {visible.length === 0 ? (
        <p className="body text-mute">Nothing published here yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <ResearchCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
