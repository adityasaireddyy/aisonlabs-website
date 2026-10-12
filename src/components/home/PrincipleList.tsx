"use client";

import { useState } from "react";
import type { Principle } from "@/data/philosophy";
import { principleIcon } from "@/data/icons";
import { IconBox } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Accordion of principles with an icon each: hover, focus or click opens one at a time. */
export default function PrincipleList({ principles }: { principles: Principle[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="divide-y divide-line border-y border-line">
      {principles.map((p, i) => {
        const on = open === i;
        return (
          <li key={p.index}>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`principle-${i}`}
              onClick={() => setOpen(i)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(i)}
              onFocus={() => setOpen(i)}
              className="group flex w-full items-center gap-5 py-5 text-left md:gap-6 md:py-6"
            >
              <IconBox name={principleIcon(p.index)} tone={on ? "accent" : "line"} />
              <span className="flex flex-col">
                <span className={cn("tabular text-[12px] font-semibold transition-colors", on ? "text-accent" : "text-mute")}>{p.index}</span>
                <span className={cn("text-[clamp(1.25rem,2.4vw,1.875rem)] font-semibold tracking-[-0.03em] transition-[color,transform] duration-300", on ? "translate-x-1 text-fg" : "text-fg/55 group-hover:text-fg")}>
                  {p.title}
                </span>
              </span>
            </button>
            <div id={`principle-${i}`} role="region" className={cn("grid transition-[grid-template-rows,opacity] duration-400 ease-out", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="body max-w-[52ch] pb-6 pl-[4.25rem] text-mute md:pl-[4.5rem]">{p.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
