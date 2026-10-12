import type { ReactNode } from "react";
import Link from "next/link";
import ArticleBody from "@/components/research/ArticleBody";
import Reveal from "@/components/ui/Reveal";

type Props = {
  backHref: string;
  backLabel: string;
  category: string;
  title: string;
  dek?: string;
  meta: string;
  author?: string;
  coverUrl?: string | null;
  markdown: string;
  tags?: string[];
  children?: ReactNode;
};

/** Shared reading layout for research articles and blog posts. */
export default function ArticleLayout({ backHref, backLabel, category, title, dek, meta, author, coverUrl, markdown, tags, children }: Props) {
  return (
    <>
      <section data-theme="dark" className="border-b border-line">
        <div className="container-x py-[clamp(2.5rem,6vw,4.5rem)]">
          <Reveal className="mx-auto max-w-[46rem]">
            <Link href={backHref} className="label inline-flex items-center gap-1.5 transition-colors hover:text-fg">
              <span aria-hidden="true">←</span> {backLabel}
            </Link>
            <p className="eyebrow mt-6">{category}</p>
            <h1 className="h1 mt-3">{title}</h1>
            {dek && <p className="lead mt-5">{dek}</p>}
            <p className="label mt-6">
              {author && <span className="text-fg">{author}</span>}
              {author && " · "}
              {meta}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-[clamp(2.5rem,6vw,4.5rem)]">
        <div className="container-x">
          <article className="mx-auto max-w-[46rem]">
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" className="mb-10 w-full rounded-none border border-line" />
            )}
            <ArticleBody markdown={markdown} />
            {tags && tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
                {tags.map((t) => (
                  <li key={t} className="rounded-none border border-line px-3 py-1 text-[13px] text-mute">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
      {children}
    </>
  );
}
