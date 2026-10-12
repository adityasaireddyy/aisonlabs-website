import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { getSettings } from "@/lib/db/content";
import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { IconBox, type IconName } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Have a problem worth solving? Tell Aison Labs what you are trying to build, fix or rethink.",
  path: "/contact",
});

const NEXT_ICONS: IconName[] = ["Mail", "MessageSquare", "Handshake"];
const NEXT = [
  { t: "We read it", d: "Every message is read by the team, not a queue." },
  { t: "We reply personally", d: "Usually with questions. Understanding the problem comes first." },
  { t: "We talk", d: "A conversation about what you are trying to do and whether we are the right people for it." },
];

export default async function ContactPage() {
  const settings = await getSettings();
  const email = settings.contactEmail;

  return (
    <>
      <PageHeader eyebrow="Contact" title="Have a problem worth solving?" lead="Tell us what you're trying to build, fix or rethink." />

      <Section padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <Reveal as="aside">
            {email && (
              <div className="flex items-center gap-4">
                <IconBox name="Mail" tone="accent" />
                <div>
                  <p className="label">Email</p>
                  <a href={`mailto:${email}`} className="inline-block break-all text-[1.25rem] font-semibold tracking-[-0.02em] underline-offset-4 hover:underline">
                    {email}
                  </a>
                </div>
              </div>
            )}
            <div className="mt-6 flex items-center gap-4">
              <IconBox name="MapPin" tone="accent" />
              <div>
                <p className="label">Based in</p>
                <p className="text-[1.0625rem] font-medium">{site.country}</p>
              </div>
            </div>

            <div className="mt-10 border-t border-line pt-8">
              <p className="label mb-5">What happens next</p>
              <ol className="flex flex-col gap-5">
                {NEXT.map((n, i) => (
                  <li key={n.t} className="flex gap-4">
                    <IconBox name={NEXT_ICONS[i] ?? "Mail"} tone="soft" size="sm" />
                    <div>
                      <p className="text-[15px] font-semibold">{n.t}</p>
                      <p className="small mt-0.5 text-mute">{n.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm email={email} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
