"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Settings } from "@/lib/db/content";

const Ctx = createContext<Settings>({
  siteUrl: "",
  contactEmail: "",
  careersEmail: "",
  socials: { linkedin: "", x: "", instagram: "", github: "" },
});

export function SiteSettingsProvider({ settings, children }: { settings: Settings; children: ReactNode }) {
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

export function useSiteSettings() {
  return useContext(Ctx);
}

/** Socials as a list for rendering; empty hrefs render inactive. */
export function socialList(s: Settings): { label: string; href: string }[] {
  return [
    { label: "LinkedIn", href: s.socials.linkedin },
    { label: "X", href: s.socials.x },
    { label: "Instagram", href: s.socials.instagram },
    { label: "GitHub", href: s.socials.github },
  ];
}
