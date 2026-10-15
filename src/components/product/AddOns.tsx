"use client";

import { useState, type KeyboardEvent } from "react";
import type { EduAddonGroup } from "@/data/edu-addons";
import Icon, { IconBox } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Optional capabilities, grouped. Each is built to requirement, not part of the standard platform. */
export default function AddOns({ groups }: { groups: EduAddonGroup[] }) {
  const [active, setActive] = useState(groups[0].id);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = groups.findIndex((g) => g.id === active);
    let n = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % groups.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + groups.length) % groups.length;
    else return;
    e.preventDefault();
    setActive(groups[n].id);
    document.getElementById(`addon-tab-${groups[n].id}`)?.focus();
  };

  return (
    <div className="card overflow-hidden lg:grid lg:grid-cols-[15rem_1fr]">
      <div role="tablist" aria-label="Optional add-ons" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
        {groups.map((g) => {
          const on = g.id === active;
          return (
            <button
              key={g.id}
              id={`addon-tab-${g.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="addon-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(g.id)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(g.id)}
              className={cn(
                "flex shrink-0 items-center gap-3 px-3.5 py-3 text-left text-[15px] font-medium transition-colors duration-200",
                on ? "bg-fg text-bg" : "text-mute hover:bg-fg/[0.06] hover:text-fg",
              )}
            >
              <Icon name={g.icon} size={20} />
              {g.label}
            </button>
          );
        })}
      </div>

      <div id="addon-panel" role="tabpanel" aria-labelledby={`addon-tab-${current.id}`} className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="h3">{current.label}</h3>
          <span className="border border-line-strong px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]">Optional</span>
        </div>
        <ul key={current.id} className="mt-6 grid gap-3 sm:grid-cols-2">
          {current.items.map((it, i) => (
            <li key={it.title} style={{ animationDelay: `${i * 40}ms` }} className="pop-in">
              <div className="group flex h-full gap-4 border border-dashed border-line-strong p-4 transition-colors duration-200 hover:border-solid hover:border-fg">
                <IconBox name={it.icon} size="sm" tone="soft" className="group-hover:bg-accent group-hover:text-white" />
                <div>
                  <p className="text-[1rem] font-semibold tracking-[-0.015em]">{it.title}</p>
                  <p className="small mt-1 text-mute">{it.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <p className="small max-w-[46ch] text-mute">Not part of the standard platform. Each add-on is scoped with the institution and developed to its requirements.</p>
          <Button href="/contact" variant="link">
            Ask about an add-on
          </Button>
        </div>
      </div>
    </div>
  );
}
