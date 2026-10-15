import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getSettings, listJobs } from "@/lib/db/content";
import { principles } from "@/data/philosophy";
import PageHeader from "@/components/sections/PageHeader";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import JobCard from "@/components/careers/JobCard";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { IconBox } from "@/components/ui/Icon";
import { principleIcon } from "@/data/icons";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Join Aison Labs, a technology company from India building Aison Edu and custom software for organizations.",
  path: "/careers",
});

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([listJobs({ status: "open" }), getSettings()]);
  const email = settings.careersEmail || settings.contactEmail;

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build what comes next, with us."
        lead="We are a small team. That means real responsibility early, direct contact with the people using what you build, and no layers between an idea and a shipped system."
      >
        <Button href="#apply" size="lg" variant="secondary">
          Open application
        </Button>
      </PageHeader>

      <Section padding="lg">
        <SectionHeader eyebrow="Open roles" title={jobs.length ? `${jobs.length} open ${jobs.length === 1 ? "role" : "roles"}` : "No open roles right now"} lead={jobs.length ? undefined : "That does not mean no conversation. If you think you should be part of what we are building, use the open application below. We read all of them."} />
        {jobs.length > 0 && (
          <div className="flex flex-col gap-4">
            {jobs.map((j, i) => (
              <Reveal key={j.id} delay={i * 50}>
                <JobCard job={j} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <Section tone="soft" padding="lg" border>
        <SectionHeader eyebrow="How we work" title="What it is like to build here." />
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

      <Section padding="lg" border id="apply">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Open application</p>
            <h2 className="h2">Not on the list?</h2>
            <p className="lead mt-4">Tell us what you do well and what you want to build. We would rather hear from the right person early than post a role later.</p>
          </Reveal>
          <Reveal delay={100}>
            <ApplicationForm jobId={null} jobTitle="Open application" email={email} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
