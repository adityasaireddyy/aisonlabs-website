import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { principles } from "@/data/philosophy";
import PageHeader from "@/components/sections/PageHeader";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import VisionMission from "@/components/sections/VisionMission";
import CTA from "@/components/sections/CTA";
import { IconBox, type IconName } from "@/components/ui/Icon";
import { principleIcon } from "@/data/icons";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Aison Labs is a technology company from India building Aison Edu and engineering custom software for organizations, with the ambition to help change the technology landscape of India.",
  path: "/about",
});

const DOES_ICONS: IconName[] = ["Rocket", "Settings2", "Telescope"];
const DOES = [
  { t: "Build products", d: "Our own platforms, starting with Aison Edu, designed to scale beyond one organization." },
  { t: "Engineer custom systems", d: "Software built around how a specific organization operates, when its own logic matters more than a template." },
  { t: "Research what comes next", d: "Emerging technology explored against real requirements before it goes into a build." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="A small technology company with a large horizon."
        lead="Aison Labs is a technology company from India. We build products, engineer custom systems and research what comes next, for organizations across the country."
      />

      <Section padding="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Our belief</p>
            <h2 className="h2">Technology shouldn&apos;t force organizations to change. It should adapt to them.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lead">
              Most organizational software quietly asks people to reorganize themselves around it. We build the other way round: systems shaped around how organizations actually operate, combining product thinking, engineering and customization.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section padding="lg" border>
        <SectionHeader eyebrow="Direction" title="Where we are going, and how." />
        <VisionMission />
      </Section>

      <Section tone="soft" padding="lg" border>
        <SectionHeader eyebrow="What we do" title="Products, engineering and research." lead="We work in two directions at once, and the two feed each other." />
        <ul className="grid gap-5 md:grid-cols-3">
          {DOES.map((d, i) => (
            <Reveal as="li" key={d.t} delay={i * 60} className="card p-6 md:p-8">
              <IconBox name={DOES_ICONS[i] ?? "Rocket"} tone="accent" size="lg" />
              <h3 className="h3 mt-6">{d.t}</h3>
              <p className="body mt-3 text-mute">{d.d}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section padding="lg" border>
        <SectionHeader eyebrow="Principles" title="How we think about building anything." />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.index} delay={i * 50} className="card p-6">
              <IconBox name={principleIcon(p.index)} tone="soft" />
              <h3 className="mt-4 text-[1.0625rem] font-semibold tracking-[-0.015em]">{p.title}</h3>
              <p className="small mt-2 text-mute">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="dark" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Where we are</p>
            <h2 className="h2">We&apos;re early. That&apos;s not a limitation. It&apos;s an advantage.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lead">
              We are still a startup. We are learning, experimenting and building, and we are small enough to rethink assumptions and work from first principles.
            </p>
            <p className="lead mt-4">
              India is changing, and its technology should change with it. Our larger ambition is to help change the technology landscape of India. We have not done that yet. We are building toward it, and we would rather say so plainly.
            </p>
            <div className="mt-7">
              <Button href="/careers" variant="secondary" arrow>
                Work with us
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <CTA title="Want to build with us?" body="Whether you have a problem, a product idea or a research question, start with a message." />
    </>
  );
}
