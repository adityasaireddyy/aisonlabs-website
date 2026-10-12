"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const GROUPS: { label: string; items: { href: string; label: string; badge?: "leadsNew" | "applicationsNew" }[] }[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard" }] },
  {
    label: "CRM",
    items: [
      { href: "/admin/leads", label: "Leads", badge: "leadsNew" },
      { href: "/admin/applications", label: "Applications", badge: "applicationsNew" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/research", label: "Research" },
      { href: "/admin/careers", label: "Careers" },
      { href: "/admin/clients", label: "Clients" },
    ],
  },
  { label: "System", items: [{ href: "/admin/settings", label: "Settings" }] },
];

export default function AdminNav({ counts }: { counts: { leadsNew: number; applicationsNew: number } }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-row gap-4 overflow-x-auto px-5 py-3 lg:flex-col lg:gap-6 lg:py-5">
      {GROUPS.map((g) => (
        <div key={g.label} className="flex shrink-0 flex-row items-center gap-1 lg:flex-col lg:items-stretch">
          <span className="t-mono mr-2 hidden text-mute lg:mb-2 lg:block">{g.label}</span>
          {g.items.map((it) => {
            const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
            const n = it.badge ? counts[it.badge] : 0;
            return (
              <Link
                key={it.href}
                href={it.href}
                prefetch={false}
                className={cn(
                  "flex items-center justify-between gap-3 whitespace-nowrap border-l-2 px-3 py-1.5 text-[14px] transition-colors",
                  active ? "border-accent text-fg" : "border-transparent text-mute hover:text-fg",
                )}
              >
                {it.label}
                {n > 0 && <span className="t-mono border border-accent px-1.5 py-0.5 text-[10px] text-accent">{n}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
