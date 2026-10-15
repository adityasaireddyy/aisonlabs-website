"use client";

import { useState, type KeyboardEvent } from "react";
import type { EduModuleGroup } from "@/data/products";
import { MODULE_DESC } from "@/data/edu-features";
import { groupIcon, moduleIcon } from "@/data/icons";
import Icon, { IconBox } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Module explorer. Pick an area and its modules appear as tiles, each with an
 * icon and a one-line description. Arrow keys move between areas.
 */
export default function ModuleExplorer({ groups }: { groups: EduModuleGroup[] }) {
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
    document.getElementById(`mod-tab-${groups[n].id}`)?.focus();
  };

  return (
    <div className="card overflow-hidden lg:grid lg:grid-cols-[15rem_1fr]">
      <div role="tablist" aria-label="Aison Edu areas" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
        {groups.map((g) => {
          const on = g.id === active;
          return (
            <button
              key={g.id}
              id={`mod-tab-${g.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="mod-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(g.id)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(g.id)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-3 px-3.5 py-3 text-left text-[15px] font-medium transition-colors duration-200",
                on ? "bg-fg text-bg" : "text-mute hover:bg-fg/[0.06] hover:text-fg",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon name={groupIcon(g.id)} size={20} />
                {g.label}
              </span>
              <span className={cn("tabular text-[12px]", on ? "text-bg/70" : "text-mute")}>{g.modules.length}</span>
            </button>
          );
        })}
      </div>

      <div id="mod-panel" role="tabpanel" aria-labelledby={`mod-tab-${current.id}`} className="p-5 md:p-8">
        <div className="flex items-center gap-4">
          <IconBox name={groupIcon(current.id)} tone="accent" size="lg" />
          <div>
            <h3 className="h3">{current.label}</h3>
            <p className="small mt-1 max-w-[52ch] text-mute">{current.body}</p>
          </div>
        </div>
        <ul key={current.id} className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {current.modules.map((m, i) => (
            <li key={m} style={{ animationDelay: `${i * 40}ms` }} className="pop-in">
              <div className="group h-full border border-line p-4 transition-colors duration-200 hover:border-fg">
                <IconBox name={moduleIcon(m)} size="sm" tone="soft" className="group-hover:bg-accent group-hover:text-white" />
                <p className="mt-4 text-[1rem] font-semibold tracking-[-0.015em]">{m}</p>
                <p className="small mt-1 text-mute">{MODULE_DESC[m]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
