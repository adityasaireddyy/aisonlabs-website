import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listArticles } from "@/lib/db/content";
import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import ResearchList from "@/components/research/ResearchList";
import CTA from "@/components/sections/CTA";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description: "Perspectives, architecture notes and experiments from Aison Labs on education technology, software architecture, AI in organizational software and product engineering.",
  path: "/research",
});

export default async function ResearchPage() {
  const articles = await listArticles({ status: "published" });
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Where we explore what comes next."
        lead="A working notebook: perspectives, architecture notes and experiments from the work, published when they are worth reading."
      />
      <Section padding="lg">
        <ResearchList articles={articles} />
      </Section>
      <CTA title="Working on something in these fields?" body="We are open to conversations, collaborations and problems that push the research forward." />
    </>
  );
}
