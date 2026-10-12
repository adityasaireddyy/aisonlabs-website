"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Screen = { id: string; label: string; src: string; width: number; height: number; alt: string };

/** Phone screens you can switch between: click, tap or use the labels. The chosen one comes forward. */
export default function PhoneStack({ screens }: { screens: Screen[] }) {
  const [active, setActive] = useState(Math.min(1, screens.length - 1));

  return (
    <div>
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        {screens.map((sc, i) => {
          const on = i === active;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${sc.label} screen`}
              aria-pressed={on}
              data-tilt={on ? 6 : undefined}
              className={cn(
                "w-1/3 max-w-[15rem] overflow-hidden rounded-[1.25rem] border bg-black text-left transition-[transform,opacity,border-color,box-shadow] duration-500 ease-out sm:rounded-[1.75rem]",
                on ? "z-10 -translate-y-3 scale-[1.06] border-fg/60 opacity-100 shadow-[0_40px_90px_-30px_rgba(120,160,255,0.5)]" : "scale-95 border-line-strong opacity-60 hover:opacity-90",
              )}
            >
              <Image src={sc.src} alt={sc.alt} width={sc.width} height={sc.height} sizes="(min-width: 1024px) 240px, 33vw" className="block h-auto w-full" />
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Parent app screens">
        {screens.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn("rounded-none border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200", i === active ? "border-fg bg-fg text-bg" : "border-line-strong text-fg hover:border-fg")}
          >
            {sc.label}
          </button>
        ))}
      </div>
      <p className="small mt-4 text-center text-mute">The Aison Edu V2 parent app, shown with demo data.</p>
    </div>
  );
}
