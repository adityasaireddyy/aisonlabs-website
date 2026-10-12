import type { ReactNode } from "react";
import { organizationJsonLd } from "@/lib/seo";
import { getSettings } from "@/lib/db/content";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { SiteSettingsProvider } from "@/components/layout/SiteSettings";
import Interactions from "@/components/ui/Interactions";

export const dynamic = "force-dynamic";

/** Marketing site shell: header, main, footer. */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <SiteSettingsProvider settings={settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(settings.contactEmail)) }} />
      <a href="#main" className="sr-only z-[100] rounded-none bg-fg px-4 py-2 text-[14px] font-medium text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Interactions />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </SiteSettingsProvider>
  );
}
