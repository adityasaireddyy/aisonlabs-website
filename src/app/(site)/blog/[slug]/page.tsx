import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { getPost, listPosts } from "@/lib/db/content";
import { formatDate, readingTime } from "@/lib/markdown";
import ArticleLayout from "@/components/research/ArticleLayout";
import PostCard from "@/components/blog/PostCard";
import Section, { SectionHeader } from "@/components/ui/Section";
import CTA from "@/components/sections/CTA";

export const revalidate = 60;

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getPost(slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, type: "article", publishedTime: p.publishedAt ?? undefined });
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = (await listPosts({ status: "published" })).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd({ title: post.title, dek: post.excerpt, date: post.publishedAt ?? post.createdAt, path: `/blog/${post.slug}` })),
        }}
      />
      <ArticleLayout
        backHref="/blog"
        backLabel="All posts"
        category={post.category || "Blog"}
        title={post.title}
        dek={post.excerpt}
        author={post.author || "Aison Labs"}
        meta={`${formatDate(post.publishedAt)} · ${readingTime(post.content)} min read`}
        coverUrl={post.coverUrl}
        markdown={post.content}
        tags={post.tags}
      >
        {more.length > 0 && (
          <Section tone="soft" padding="lg" border>
            <SectionHeader title="More from the blog" />
            <div className="grid gap-5 md:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </Section>
        )}
        <CTA />
      </ArticleLayout>
    </>
  );
}
