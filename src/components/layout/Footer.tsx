"use client";

import Link from "next/link";
import { footerGroups, site } from "@/data/site";
import { socialList, useSiteSettings } from "@/components/layout/SiteSettings";
import { LogoMark } from "@/components/ui/Logo";

/** Footer in the reference's register: a big wordmark line, one row of plain links, a copyright. */
export default function Footer() {
  const settings = useSiteSettings();
  const socials = socialList(settings).filter((s) => s.href);
  const year = new Date().getFullYear();
  const links = footerGroups.flatMap((g) => g.links).filter((l, i, a) => a.findIndex((x) => x.href === l.href) === i);

  return (
    <footer data-theme="dark" className="theme-scope border-t border-line">
      <div className="container-x py-[clamp(3.5rem,7vw,6rem)]">
        <Link href="/" aria-label="Aison Labs, home" className="inline-flex flex-wrap items-center gap-x-5 gap-y-3">
          <LogoMark size={56} accent title="" />
          <span className="flex flex-col">
            <span className="text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-mute">Building what comes next with</span>
            <span className="text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-none tracking-[-0.035em]">Aison Labs</span>
          </span>
        </Link>

        <nav aria-label="Footer" className="mt-12">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] font-medium text-fg/85 underline-offset-4 transition-colors hover:text-accent hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            {settings.contactEmail && (
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="text-[15px] font-medium text-fg/85 underline-offset-4 transition-colors hover:text-accent hover:underline">
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-[15px] font-medium text-fg/85 underline-offset-4 transition-colors hover:text-accent hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="small mt-10 text-mute">
          &copy; {year} {site.legalName}. All rights reserved. Built in {site.country}.
        </p>
      </div>
    </footer>
  );
}
