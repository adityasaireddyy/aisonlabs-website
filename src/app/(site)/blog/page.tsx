import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listPosts } from "@/lib/db/content";
import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import PostCard from "@/components/blog/PostCard";
import CTA from "@/components/sections/CTA";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Notes from Aison Labs: what we are building, what we are learning, and what is changing around us.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await listPosts({ status: "published" });
  const [latest, ...rest] = posts;

  return (
    <>
      <PageHeader eyebrow="Blog" title="Notes from the team." lead="Shorter and more frequent than research: what we are building, what we are learning and what is changing around us." />

      <Section padding="lg">
        {posts.length === 0 ? (
          <Reveal className="card mx-auto max-w-[36rem] p-8 text-center md:p-12">
            <h2 className="h3">The first post is being written.</h2>
            <p className="body mt-3 text-mute">In the meantime, our research notes are already published.</p>
            <div className="mt-6">
              <Button href="/research" variant="secondary" arrow>
                Read research
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-5">
            <Reveal>
              <PostCard post={latest} featured />
            </Reveal>
            {rest.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 60} className="h-full">
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </Section>

      <CTA />
    </>
  );
}
