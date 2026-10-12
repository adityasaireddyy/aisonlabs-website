"use client";

import { useState } from "react";
import type { EduScreen } from "@/data/products";
import EduShot from "./EduShot";
import { cn } from "@/lib/utils";

/** Tabbed gallery of real product screens. */
export default function EduGallery({ screens }: { screens: EduScreen[] }) {
  const [active, setActive] = useState(screens[0].id);
  const current = screens.find((s) => s.id === active) ?? screens[0];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Product screens">
        {screens.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`edu-tab-${s.id}`}
            aria-selected={s.id === active}
            aria-controls="edu-gallery-panel"
            onClick={() => setActive(s.id)}
            className={cn(
              "rounded-none border px-4 py-2 text-[14px] font-medium transition-colors duration-200",
              s.id === active ? "border-fg bg-fg text-bg" : "border-line-strong text-fg hover:border-fg",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div id="edu-gallery-panel" role="tabpanel" aria-labelledby={`edu-tab-${current.id}`}>
        <EduShot key={current.id} screen={current} caption="Aison Edu V2, shown with sample data." />
      </div>
    </div>
  );
}
