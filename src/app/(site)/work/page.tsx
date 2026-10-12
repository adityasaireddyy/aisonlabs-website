import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { process, services, servicesPositioning } from "@/data/services";
import { listClientViews } from "@/lib/db/content";
import PageHeader from "@/components/sections/PageHeader";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import CTA from "@/components/sections/CTA";
import { IconBox } from "@/components/ui/Icon";
import { processIcon, serviceIcon } from "@/data/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Aison Labs designs and engineers custom software, web and mobile applications, enterprise platforms and integrations around the specific requirements of organizations.",
  path: "/work",
});

export default async function ServicesPage() {
  const serviceClients = (await listClientViews()).filter((c) => c.kind === "service");

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Technology built around your organization."
        lead={`${servicesPositioning} We design and engineer digital systems around the specific requirements of the organizations we work with.`}
      >
        <Button href="/contact" size="lg" arrow>
          Discuss a project
        </Button>
      </PageHeader>

      <Section padding="lg" id="services">
        <SectionHeader eyebrow="What we build" title="Engineering services" lead="From a single application to the systems a whole organization runs on." />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 60} className="card relative p-6">
              <div className="flex items-center justify-between">
                <IconBox name={serviceIcon(s.index)} tone="soft" />
                <span className="tabular text-[13px] font-medium text-mute">{s.index}</span>
              </div>
              <h3 className="h3 mt-5"><Link href={`/work/${s.slug}`} className="after:absolute after:inset-0 after:content-['']">{s.title}</Link></h3>
              <p className="small mt-2 text-mute">{s.body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-accent">Learn more <ArrowIcon className="h-4 w-4" /></span>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="soft" padding="lg" border id="process">
        <SectionHeader eyebrow="How we work" title="A deliberate process, start to finish." lead="Handover is not the end. We stay close to the systems we build." />
        <ol className="grid gap-5 md:grid-cols-5">
          {process.map((p, i) => (
            <Reveal as="li" key={p.i} delay={i * 60} className="card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <IconBox name={processIcon(i)} tone="accent" />
                <span className="tabular text-[13px] font-semibold text-mute">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.015em]">{p.t}</h3>
              <p className="small mt-2 text-mute">{p.d}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {serviceClients.length > 0 && (
        <Section padding="lg" border id="clients">
          <SectionHeader
            eyebrow="Clients"
            title="Organizations we are building with."
            lead="Case studies are published only with each organization's approval. Until then we would rather show fewer details than invent them."
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceClients.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={(i % 3) * 60} className="card flex items-center justify-between gap-4 p-6" >
                <div className="min-w-0" data-row>
                  <p className="truncate text-[1.125rem] font-semibold tracking-[-0.02em]">{c.name}</p>
                  <p className="small mt-1 text-mute">{c.descriptor ?? "Service client"}</p>
                </div>
                {c.caseStudy?.href ? (
                  <Button href={c.caseStudy.href} variant="link" arrow>
                    Case study
                  </Button>
                ) : (
                  <span className="shrink-0 rounded-none border border-line px-3 py-1 text-[12px] text-mute">Case study soon</span>
                )}
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <CTA title="Have a system that needs building?" body="Tell us what your organization is trying to do and where the current tools get in the way." />
    </>
  );
}
