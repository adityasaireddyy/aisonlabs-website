import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getJob, getSettings } from "@/lib/db/content";
import { formatDate } from "@/lib/markdown";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import ArticleBody from "@/components/research/ArticleBody";
import ApplicationForm from "@/components/careers/ApplicationForm";

export const revalidate = 60;

export async function generateMetadata(props: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const j = await getJob(slug);
  if (!j) return {};
  return buildMetadata({ title: `${j.title} — Careers`, description: j.summary || `Join Aison Labs as ${j.title}.`, path: `/careers/${j.slug}` });
}

export default async function JobPage(props: PageProps<"/careers/[slug]">) {
  const { slug } = await props.params;
  const [job, settings] = await Promise.all([getJob(slug), getSettings()]);
  if (!job) notFound();
  const email = job.applyEmail || settings.careersEmail || settings.contactEmail;
  const meta = [job.team, job.location, job.type].filter(Boolean);

  return (
    <>
      <section data-theme="dark" className="border-b border-line">
        <div className="container-x py-[clamp(2.5rem,6vw,4.5rem)]">
          <Reveal className="max-w-[48rem]">
            <Link href="/careers" className="label inline-flex items-center gap-1.5 transition-colors hover:text-fg">
              <span aria-hidden="true">←</span> All roles
            </Link>
            <h1 className="h1 mt-6">{job.title}</h1>
            {job.summary && <p className="lead mt-5">{job.summary}</p>}
            <ul className="mt-6 flex flex-wrap gap-2">
              {meta.map((m) => (
                <li key={m} className="rounded-none border border-line bg-bg px-3 py-1 text-[13px] font-medium">
                  {m}
                </li>
              ))}
              <li className="rounded-none px-1 py-1 text-[13px] text-mute">Posted {formatDate(job.createdAt)}</li>
            </ul>
            <div className="mt-8">
              <Button href="#apply" size="lg" arrow>
                Apply for this role
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section padding="lg">
        <article className="max-w-[46rem]">
          <ArticleBody markdown={job.content} />
        </article>
      </Section>

      <Section tone="soft" padding="lg" border id="apply">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">Apply</p>
            <h2 className="h2">Tell us about you.</h2>
            <p className="lead mt-4">A few honest lines and links to your work are enough to start.</p>
          </Reveal>
          <Reveal delay={100}>
            <ApplicationForm jobId={job.id} jobTitle={job.title} email={email} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
