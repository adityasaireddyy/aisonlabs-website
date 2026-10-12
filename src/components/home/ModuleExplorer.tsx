"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import type { EduModuleGroup } from "@/data/products";
import { GROUP_SCREEN, MODULE_SCREEN, groupIcon, moduleIcon } from "@/data/icons";
import Icon, { IconBox } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Module explorer. Pick a group, then a module: the picture on the right
 * switches to the real screen for that module where one exists, and to a
 * grid of the group's icons where it does not. Arrow keys move between groups.
 */
export default function ModuleExplorer({ groups }: { groups: EduModuleGroup[] }) {
  const [active, setActive] = useState(groups[0].id);
  const [mod, setMod] = useState<string | null>(null);
  const current = groups.find((g) => g.id === active) ?? groups[0];
  const screen = (mod && current.modules.includes(mod) ? MODULE_SCREEN[mod] : undefined) ?? GROUP_SCREEN[current.id];

  const pick = (id: string) => {
    setActive(id);
    setMod(null);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = groups.findIndex((g) => g.id === active);
    let n = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % groups.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + groups.length) % groups.length;
    else return;
    e.preventDefault();
    pick(groups[n].id);
    document.getElementById(`mod-tab-${groups[n].id}`)?.focus();
  };

  return (
    <div className="card overflow-hidden lg:grid lg:grid-cols-[14rem_1fr]">
      <div role="tablist" aria-label="Aison Edu modules" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
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
              onClick={() => pick(g.id)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && pick(g.id)}
              className={cn(
                "flex shrink-0 items-center gap-3 px-3.5 py-3 text-left text-[15px] font-medium transition-colors duration-200",
                on ? "bg-fg text-bg" : "text-mute hover:bg-fg/[0.06] hover:text-fg",
              )}
            >
              <Icon name={groupIcon(g.id)} size={20} />
              {g.label}
            </button>
          );
        })}
      </div>

      <div id="mod-panel" role="tabpanel" aria-labelledby={`mod-tab-${current.id}`} className="grid gap-6 p-5 md:p-7 xl:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <IconBox name={groupIcon(current.id)} tone="accent" />
            <h3 className="h3">{current.label}</h3>
          </div>
          <p className="small mt-3 max-w-[40ch] text-mute">{current.body}</p>
          <ul key={current.id} className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {current.modules.map((m, i) => {
              const on = mod === m;
              return (
                <li key={m} style={{ animationDelay: `${i * 40}ms` }} className="pop-in">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setMod(on ? null : m)}
                    onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setMod(m)}
                    onFocus={() => setMod(m)}
                    className={cn(
                      "flex w-full items-center gap-3 border px-3 py-2.5 text-left text-[14px] font-medium transition-colors duration-200",
                      on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
                    )}
                  >
                    <Icon name={moduleIcon(m)} size={18} className={on ? "text-bg" : "text-accent"} />
                    {m}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0 self-stretch">
          {screen ? (
            <figure key={screen.id} className="pop-in m-0">
              <div className="overflow-hidden border border-line-strong bg-white shadow-[0_30px_70px_-40px_rgba(12,12,13,0.5)]">
                <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes="(min-width: 1280px) 560px, 100vw" className="block h-auto w-full" />
              </div>
              <figcaption className="small mt-2 text-mute">Aison Edu V2{mod && MODULE_SCREEN[mod] ? `, ${mod.toLowerCase()}` : ""}, with sample data.</figcaption>
            </figure>
          ) : (
            <div key={current.id} className="pop-in grid h-full min-h-[14rem] grid-cols-3 gap-3 content-center">
              {current.modules.map((m) => (
                <div key={m} className="flex aspect-square flex-col items-center justify-center gap-3 border border-line bg-fg/[0.03] p-3 text-center">
                  <Icon name={moduleIcon(m)} size={34} strokeWidth={1.4} className="text-accent" />
                  <span className="text-[12px] font-medium leading-tight">{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
