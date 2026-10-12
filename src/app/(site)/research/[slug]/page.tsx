import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { getArticle, listArticles } from "@/lib/db/content";
import { formatDate, readingTime } from "@/lib/markdown";
import ArticleLayout from "@/components/research/ArticleLayout";
import ResearchCard from "@/components/research/ResearchCard";
import Section, { SectionHeader } from "@/components/ui/Section";
import CTA from "@/components/sections/CTA";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.dek, path: `/research/${a.slug}`, type: "article", publishedTime: a.publishedAt ?? undefined });
}

export default async function ArticlePage(props: PageProps<"/research/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const more = (await listArticles({ status: "published" })).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd({ title: article.title, dek: article.dek, date: article.publishedAt ?? article.createdAt, path: `/research/${article.slug}` })),
        }}
      />
      <ArticleLayout
        backHref="/research"
        backLabel="All research"
        category={article.category}
        title={article.title}
        dek={article.dek}
        author="Aison Labs"
        meta={`${formatDate(article.publishedAt)} · ${readingTime(article.content)} min read`}
        markdown={article.content}
      >
        {more.length > 0 && (
          <Section tone="soft" padding="lg" border>
            <SectionHeader title="More research" />
            <div className="grid gap-5 md:grid-cols-3">
              {more.map((a) => (
                <ResearchCard key={a.slug} article={a} />
              ))}
            </div>
          </Section>
        )}
        <CTA />
      </ArticleLayout>
    </>
  );
}
