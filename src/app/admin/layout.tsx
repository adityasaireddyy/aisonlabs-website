import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getSession, usingDefaultPassword } from "@/lib/auth";
import { crmCounts } from "@/lib/db/crm";
import { LogoMark } from "@/components/ui/Logo";
import { logoutAction } from "./actions";
import AdminNav from "./nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Aison Labs Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Admin shell: sidebar navigation + content. The login page renders bare. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    return (
      <div data-theme="dark" className="theme-scope flex min-h-screen flex-col">
        {children}
      </div>
    );
  }

  const [counts, defaultPw] = await Promise.all([crmCounts(), usingDefaultPassword(session.uid)]);

  return (
    <div data-theme="dark" className="theme-scope flex min-h-screen flex-col lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-line lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="border-b border-line px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark size={22} accent />
            <span className="text-[14px] font-semibold tracking-[-0.02em]">AISON LABS</span>
          </Link>
          <p className="t-mono mt-1.5 text-mute">CMS · CRM</p>
        </div>
        <AdminNav counts={{ leadsNew: counts.leadsNew, applicationsNew: counts.applicationsNew }} />
        <div className="mt-auto border-t border-line px-5 py-4">
          <p className="truncate text-[13px]">{session.name}</p>
          <p className="t-mono truncate text-mute">{session.email}</p>
          <div className="mt-3 flex items-center gap-5">
            <form action={logoutAction}>
              <button type="submit" className="t-mono text-mute hover:text-accent">
                Sign out
              </button>
            </form>
            <Link href="/" className="t-mono text-mute hover:text-fg" target="_blank">
              View site ↗
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {defaultPw && (
          <div className="border-b border-accent/50 bg-accent/10 px-6 py-3">
            <p className="t-mono text-accent">
              You are using the default admin password. Change it in{" "}
              <Link href="/admin/settings" className="underline">
                Settings
              </Link>{" "}
              before this goes live.
            </p>
          </div>
        )}
        <main className="flex-1 px-5 py-8 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
