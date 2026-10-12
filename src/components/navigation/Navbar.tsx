"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/data/site";
import { LogoMark } from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Site header: always black, minimal text navigation, an accent underline for
 * the current page and one solid action. Transparent over the hero.
 * Below lg the links open as a full-height panel.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [onHero, setOnHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero");
      setOnHero(!!hero && hero.getBoundingClientRect().bottom > 72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      data-theme="dark"
      className={cn("sticky top-0 z-50 border-b text-fg transition-colors duration-300", onHero && !open ? "border-transparent bg-transparent" : "border-line bg-bg/90 backdrop-blur-md")}
    >
      <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Aison Labs, home" onClick={() => setOpen(false)}>
          <LogoMark size={30} accent title="" />
          <span className="text-[18px] font-bold uppercase tracking-[0.02em]">Aison Labs</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative block py-2 text-[15px] font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-accent after:transition-transform after:duration-300",
                    isActive(item.href) ? "text-fg after:scale-x-100" : "text-fg/75 after:scale-x-0 hover:text-fg hover:after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/contact" className="hidden sm:inline-flex">
            Contact us
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span className={cn("absolute left-0 top-0 h-[2px] w-full bg-fg transition-transform duration-200", open && "translate-y-[5px] rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-[2px] w-full bg-fg transition-transform duration-200", open && "-translate-y-[5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="absolute inset-x-0 top-full h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-t border-line bg-bg lg:hidden">
        <nav aria-label="Mobile" className="container-x flex flex-col py-6">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("border-b border-line py-5 text-[1.75rem] font-medium tracking-[-0.025em]", isActive(item.href) && "text-accent")}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-8">
            <Button href="/contact" size="lg" arrow className="w-full" onClick={() => setOpen(false)}>
              Contact us
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
