import type { Metadata } from "next";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { aisonEdu, eduMobile, eduModuleGroups, eduTransport } from "@/data/products";
import { eduCounts, eduHighlights, eduRoleSummaries } from "@/data/edu-features";
import { listClientViews } from "@/lib/db/content";
import PageHeader from "@/components/sections/PageHeader";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import ModuleExplorer from "@/components/home/ModuleExplorer";
import DeploymentModels from "@/components/product/DeploymentModels";
import AddOns from "@/components/product/AddOns";
import { eduAddonGroups } from "@/data/edu-addons";
import RouteDiagram from "@/components/product/RouteDiagram";
import CTA from "@/components/sections/CTA";
import Icon, { IconBox, type IconName } from "@/components/ui/Icon";
import { roleIcon } from "@/data/icons";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: aisonEdu.seo.title,
  description: aisonEdu.seo.description,
  path: "/products/aison-edu",
});

const TRANSPORT_ICONS: IconName[] = ["MapPin", "Radio", "Clock", "HeartHandshake", "Bus"];

const PARENT_ICONS: Record<string, IconName> = {
  "Where the bus is": "MapPin",
  Attendance: "ClipboardCheck",
  Timetable: "CalendarClock",
  Results: "FileText",
  Fees: "Banknote",
  "Stationery account": "Wallet",
  Library: "Library",
  Transport: "Bus",
  Hostel: "BedDouble",
  "Marks memo": "FileSpreadsheet",
  Documents: "FileText",
  Notices: "Megaphone",
  "Messages to teachers": "MessageSquare",
  Assistant: "Bot",
};

export default async function AisonEduPage() {
  const deployments = (await listClientViews()).filter((c) => c.kind === "product-deployment");
  const stats = [
    { n: eduCounts.modules, label: "modules" },
    { n: eduCounts.areas, label: "areas of the institution" },
    { n: eduCounts.roles, label: "mobile roles" },
    { n: 2, label: "ways to deploy" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(aisonEdu)) }} />

      <PageHeader
        eyebrow={`${aisonEdu.name} ${aisonEdu.version} · ${aisonEdu.category}`}
        badge={<StatusBadge label={aisonEdu.statusLabel} />}
        title={aisonEdu.tagline}
        lead={aisonEdu.description}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" size="lg" arrow>
            Talk to us about Aison Edu
          </Button>
          <Button href="#features" size="lg" variant="secondary">
            See what it does
          </Button>
        </div>
      </PageHeader>

      <section data-theme="dark" className="border-b border-line">
        <ul className="container-x grid grid-cols-2 gap-px bg-line py-0 md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="bg-bg px-2 py-8 md:px-6">
              <p className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">
                <span className="text-accent">{s.n}</span>
              </p>
              <p className="label mt-3">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <Section padding="lg" id="features">
        <SectionHeader eyebrow="Aison Edu V2" title="Everything an institution runs on, in one system." lead="Academics, people, finance, campus operations and communication, with reporting and an assistant that work from the school's own records, on the web and in a mobile app." />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {eduHighlights.map((h, i) => (
            <Reveal as="li" key={h.title} delay={(i % 4) * 60} className="card flex flex-col p-6">
              <IconBox name={h.icon} tone={i % 4 === 0 ? "accent" : "soft"} size="lg" />
              <h3 className="mt-6 text-[1.1875rem] font-semibold leading-snug tracking-[-0.02em]">{h.title}</h3>
              <p className="small mt-2 text-mute">{h.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="soft" padding="lg" border id="modules">
        <SectionHeader eyebrow="Modules" title={`${eduCounts.modules} modules across ${eduCounts.areas} areas.`} lead="Pick an area to see what is inside. Each deployment is configured around the institution's own structure and workflows." />
        <Reveal>
          <ModuleExplorer groups={eduModuleGroups} />
        </Reveal>
      </Section>

      <Section padding="lg" border id="addons">
        <SectionHeader
          eyebrow="Optional add-ons"
          title="More, built to your requirements."
          lead="Aison Edu is customizable, and further capabilities are developed as an institution needs them. These are optional and not part of the standard platform, including online fee payment through a payment gateway."
        />
        <Reveal>
          <AddOns groups={eduAddonGroups} />
        </Reveal>
      </Section>

      <Section tone="soft" padding="lg" border id="roles">
        <SectionHeader eyebrow="Who it is for" title="Built for everyone the institution depends on." lead="Each role signs in with its own account and sees what it needs." />
        <ul className="grid gap-px bg-line-strong sm:grid-cols-2 lg:grid-cols-3">
          {eduRoleSummaries.map((r, i) => (
            <Reveal as="li" key={r.role} delay={(i % 3) * 60} className="group bg-[#f2f2f2] p-6 text-black transition-colors duration-200 hover:bg-black hover:text-white md:p-8">
              <IconBox name={r.icon} tone="current" />
              <h3 className="mt-6 text-[1.25rem] font-semibold tracking-[-0.02em]">{r.role}</h3>
              <p className="small mt-2 text-black/65 group-hover:text-white/70">{r.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section padding="lg" border id="transport">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Transport</p>
            <h2 className="h2">{eduTransport.title}</h2>
            <p className="lead mt-5">{eduTransport.body}</p>
            <div className="mt-8 border border-line bg-bg p-4">
              <RouteDiagram className="h-auto w-full text-fg" />
              <p className="small mt-2 text-mute">An illustration of a route: numbered stops, in the order the bus makes them.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ul className="divide-y divide-line border-y border-line">
              {eduTransport.points.map((p, i) => (
                <li key={p.t} className="flex gap-4 py-5">
                  <IconBox name={TRANSPORT_ICONS[i] ?? "MapPin"} tone={i === 1 ? "accent" : "soft"} />
                  <div>
                    <p className="text-[1.0625rem] font-semibold tracking-[-0.015em]">{p.t}</p>
                    <p className="small mt-1 text-mute">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" padding="lg" id="mobile">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="eyebrow">Mobile app</p>
              <span className="rounded-none border border-line-strong px-3 py-1 text-[13px] font-medium">Available</span>
            </div>
            <h2 className="h2">{eduMobile.title}</h2>
            <p className="lead mt-4">{eduMobile.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {eduMobile.roles.map((r) => (
                <li key={r} className="flex items-center gap-2 rounded-none bg-fg px-3.5 py-2 text-[14px] font-medium text-bg">
                  <Icon name={roleIcon(r)} size={16} />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <p className="label mb-4">In the parent app</p>
            <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
              {eduMobile.parentFeatures.map((x) => (
                <li key={x} className="flex flex-col items-start gap-3 bg-bg p-4 transition-colors duration-200 hover:bg-fg/[0.06]">
                  <Icon name={PARENT_ICONS[x] ?? "Layers"} size={24} strokeWidth={1.5} className="text-accent" />
                  <span className="text-[14px] font-medium leading-tight">{x}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="soft" padding="lg" border id="models">
        <SectionHeader
          eyebrow="Deployment"
          title="Two ways to run Aison Edu."
          lead="No institution should have to reshape itself around rigid software. Choose the common platform, or an institutional build where everything is customizable, on web and mobile."
        />
        <DeploymentModels />
      </Section>

      {deployments.length > 0 && (
        <Section padding="lg" border>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-3">In production</p>
              <h2 className="h2">In full rollout with {deployments.map((d) => d.name).join(", ")}.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lead">
                Aison Edu is running in a real institution, and that is where the platform is being shaped: by everyday institutional use rather than by a roadmap written in isolation.
              </p>
              <p className="small mt-5 text-mute">Outcomes and a case study will be published with the institution&apos;s approval.</p>
            </Reveal>
          </div>
        </Section>
      )}

      <CTA
        title="Bring Aison Edu to your institution."
        body="Tell us how your institution is organized. We will say plainly whether the platform fits as it is or an institutional deployment makes more sense."
        primary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
