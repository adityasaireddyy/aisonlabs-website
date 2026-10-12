import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { process, services } from "@/data/services";
import { serviceDetails } from "@/data/service-details";
import { processIcon, serviceIcon } from "@/data/icons";
import PageHeader from "@/components/sections/PageHeader";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button, { ArrowIcon } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Icon, { IconBox } from "@/components/ui/Icon";
import CTA from "@/components/sections/CTA";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return buildMetadata({ title: s.title, description: serviceDetails[s.slug]?.lead ?? s.body, path: `/work/${s.slug}` });
}

export default async function ServicePage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const i = services.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const s = services[i];
  const d = serviceDetails[s.slug];
  const others = services.filter((x) => x.slug !== s.slug);
  const next = services[(i + 1) % services.length];

  return (
    <>
      <PageHeader eyebrow={`Service ${s.index}`} title={s.title} lead={d.lead}>
        <Button href="/contact" size="lg">
          Talk to us about this
        </Button>
      </PageHeader>

      <Section padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <IconBox name={serviceIcon(s.index)} tone="accent" size="lg" />
            <p className="eyebrow mb-3 mt-8">What we build</p>
            <h2 className="h2">{s.body}</h2>
          </Reveal>
          <Reveal delay={100}>
            <ul className="grid gap-px bg-line sm:grid-cols-2">
              {d.builds.map((b) => (
                <li key={b} className="flex items-start gap-3 bg-bg p-5">
                  <Icon name="Check" size={20} className="mt-0.5 text-accent" />
                  <span className="text-[1.0625rem] font-medium leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="soft" padding="lg" border>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card p-6 md:p-8">
            <IconBox name="Compass" tone="soft" />
            <h3 className="h3 mt-5">When it fits</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {d.fits.map((f) => (
                <li key={f} className="body flex gap-3 text-mute">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="card p-6 md:p-8">
            <IconBox name="Hammer" tone="soft" />
            <h3 className="h3 mt-5">How we approach it</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {d.approach.map((f) => (
                <li key={f} className="body flex gap-3 text-mute">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section padding="lg">
        <SectionHeader eyebrow="Process" title="How an engagement runs." lead="The same five steps apply to every service." />
        <ol className="grid gap-5 md:grid-cols-5">
          {process.map((p, n) => (
            <Reveal as="li" key={p.i} delay={n * 60} className="card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <IconBox name={processIcon(n)} tone="accent" />
                <span className="tabular text-[13px] font-semibold text-mute">0{n + 1}</span>
              </div>
              <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.015em]">{p.t}</h3>
              <p className="small mt-2 text-mute">{p.d}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="soft" padding="lg" border>
        <SectionHeader eyebrow="More services" title="Other ways we can help." />
        <ul className="grid gap-px bg-line-strong sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug} className="bg-[#f2f2f2]">
              <Link href={`/work/${o.slug}`} className="group flex items-center gap-4 px-5 py-5 text-black transition-colors duration-200 hover:bg-black hover:text-white">
                <IconBox name={serviceIcon(o.index)} size="sm" tone="current" />
                <span className="flex-1 text-[1.0625rem] font-semibold tracking-[-0.015em]">{o.title}</span>
                <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="small mt-6 text-mute">
          Next:{" "}
          <Link href={`/work/${next.slug}`} className="font-semibold text-fg underline-offset-4 hover:underline">
            {next.title}
          </Link>
        </p>
      </Section>

      <CTA />
    </>
  );
}
