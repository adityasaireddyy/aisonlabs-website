"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/Button";

/**
 * One delegated interaction layer for the whole marketing site, so individual
 * components stay declarative:
 *  - `.card`            pointer spotlight (sets --mx / --my)
 *  - `[data-tilt]`      3D tilt toward the pointer
 *  - `[data-magnetic]`  pulls toward the pointer within a radius
 * It also renders the scroll-progress line and the back-to-top button.
 * Fine pointers only for the pointer effects; reduced motion disables them.
 */
export default function Interactions() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // scroll progress + back to top
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        setShowTop(window.scrollY > 900);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    if (!fine || reduced) {
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    let tilted: HTMLElement | null = null;
    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const resetTilt = () => {
      if (tilted) {
        tilted.style.transform = "";
        tilted = null;
      }
    };

    const frame = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      // spotlight
      const card = target?.closest<HTMLElement>(".card");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      // tilt
      const t = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (t !== tilted) resetTilt();
      if (t) {
        const r = t.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        const max = Number(t.dataset.tilt) || 5;
        t.style.transform = `perspective(1100px) rotateX(${(-ny * max).toFixed(2)}deg) rotateY(${(nx * max).toFixed(2)}deg) translateZ(0)`;
        tilted = t;
      }

      // magnetic
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
        const r = m.getBoundingClientRect();
        const mx = r.left + r.width / 2;
        const my = r.top + r.height / 2;
        const dx = e.clientX - mx;
        const dy = e.clientY - my;
        const reach = Math.max(r.width, r.height) * 0.9 + 40;
        if (Math.hypot(dx, dy) < reach) {
          m.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.28).toFixed(1)}px)`;
        } else if (m.style.transform) {
          m.style.transform = "";
        }
      });
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      resetTilt();
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => (m.style.transform = ""));
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
        <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
      <button
        type="button"
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-[55] inline-flex h-11 w-11 items-center justify-center rounded-none border border-line-strong bg-bg/90 text-fg shadow-lg backdrop-blur transition-all duration-300 hover:bg-fg hover:text-bg ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowIcon className="-rotate-90" />
      </button>
    </>
  );
}
