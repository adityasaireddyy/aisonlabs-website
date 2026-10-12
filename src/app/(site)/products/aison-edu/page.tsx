import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { aisonEdu, eduBanner, eduDashboard, eduMobile, eduModuleGroups, eduScreens, eduTransport } from "@/data/products";
import { listClientViews } from "@/lib/db/content";
import PageHeader from "@/components/sections/PageHeader";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import EduShot from "@/components/product/EduShot";
import EduGallery from "@/components/product/EduGallery";
import DeploymentModels from "@/components/product/DeploymentModels";
import PhoneStack from "@/components/product/PhoneStack";
import CTA from "@/components/sections/CTA";
import Icon, { IconBox, type IconName } from "@/components/ui/Icon";
import { groupIcon, moduleIcon, roleIcon } from "@/data/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: aisonEdu.seo.title,
  description: aisonEdu.seo.description,
  path: "/products/aison-edu",
});

const TRANSPORT_ICONS: IconName[] = ["MapPin", "Radio", "Clock", "HeartHandshake", "Bus"];

export default async function AisonEduPage() {
  const deployments = (await listClientViews()).filter((c) => c.kind === "product-deployment");

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
          <Button href="#product" size="lg" variant="secondary">
            See the product
          </Button>
        </div>
      </PageHeader>

      <Section padding="md">
        <Reveal>
          <EduShot screen={eduDashboard} priority caption="The Aison Edu V2 dashboard, shown with sample data." />
        </Reveal>
      </Section>

      <Section tone="soft" padding="lg" border>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Version 2</p>
            <h2 className="h2">Aison Edu V2 is here.</h2>
            <p className="lead mt-4">
              The current version of the platform brings academics, people, finance, campus operations and communication into one system, with reporting and an assistant that work from the school&apos;s own records, on the web and in a mobile app.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Image
              src={eduBanner.src}
              alt={eduBanner.alt}
              width={eduBanner.width}
              height={eduBanner.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full rounded-none border border-line"
            />
          </Reveal>
        </div>
      </Section>

      <Section padding="lg" border id="product">
        <SectionHeader eyebrow="Inside the product" title="A look at Aison Edu V2." lead="Real screens from the product. Every module shares the same records, so a figure on one screen is the same figure everywhere." />
        <Reveal>
          <EduGallery screens={eduScreens} />
        </Reveal>
      </Section>

      <Section tone="soft" padding="lg" border>
        <SectionHeader eyebrow="Modules" title="One system for the whole institution." lead="Each deployment is configured around the institution's own structure and workflows." />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eduModuleGroups.map((g, i) => (
            <Reveal as="li" key={g.id} delay={(i % 3) * 60} className="card flex flex-col p-6">
              <IconBox name={groupIcon(g.id)} tone="accent" />
              <h3 className="h3 mt-5">{g.label}</h3>
              <p className="small mt-2 text-mute">{g.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.modules.map((m) => (
                  <li key={m} className="flex items-center gap-2 rounded-none border border-line px-3 py-1.5 text-[13px] font-medium">
                    <Icon name={moduleIcon(m)} size={15} className="text-accent" />
                    {m}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section padding="lg" border id="transport">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Transport</p>
            <h2 className="h2">{eduTransport.title}</h2>
            <p className="lead mt-5">{eduTransport.body}</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {eduTransport.points.map((p, i) => (
                <li key={p.t} className="flex gap-4 py-4">
                  <IconBox name={TRANSPORT_ICONS[i] ?? "MapPin"} tone={i === 1 ? "accent" : "soft"} />
                  <div>
                    <p className="text-[1.0625rem] font-semibold tracking-[-0.015em]">{p.t}</p>
                    <p className="small mt-1 text-mute">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <figure className="m-0">
              <div data-tilt="3" className="overflow-hidden border border-line-strong bg-white shadow-[0_40px_90px_-40px_rgba(12,12,13,0.45)]">
                <Image src={eduTransport.map.src} alt={eduTransport.map.alt} width={eduTransport.map.width} height={eduTransport.map.height} sizes="(min-width: 1024px) 640px, 100vw" className="block h-auto w-full" />
              </div>
              <figcaption className="small mt-3 text-mute">A route in Aison Edu V2, drawn on the map with its stops in order. The line follows the roads.</figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" padding="lg" id="mobile">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
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
            <div className="mt-8 border-t border-line pt-6">
              <p className="label mb-3">In the parent app</p>
              <ul className="flex flex-wrap gap-2">
                {eduMobile.parentFeatures.map((x) => (
                  <li key={x} className="rounded-none border border-line px-3 py-1 text-[13px]">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <PhoneStack screens={eduMobile.screens} />
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
