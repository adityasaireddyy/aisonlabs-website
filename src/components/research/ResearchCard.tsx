import Link from "next/link";
import type { Article } from "@/lib/db/content";
import { formatDate, readingTime } from "@/lib/markdown";
import { ArrowIcon } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { categoryIcon } from "@/data/icons";
import { cn } from "@/lib/utils";

export type ResearchItem = Pick<Article, "slug" | "number" | "title" | "dek" | "category" | "publishedAt" | "content">;

/** Research article card. */
export default function ResearchCard({ article, className }: { article: ResearchItem; className?: string }) {
  return (
    <Link href={`/research/${article.slug}`} className={cn("card card-hover group flex h-full flex-col p-6", className)}>
      <p className="label flex items-center gap-2 text-accent">
        <Icon name={categoryIcon(article.category)} size={18} />
        {article.category}
      </p>
      <h3 className="h3 mt-3 text-balance">{article.title}</h3>
      <p className="small mt-3 line-clamp-3 text-mute">{article.dek}</p>
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="label">
          {formatDate(article.publishedAt)} · {readingTime(article.content)} min read
        </span>
        <ArrowIcon className="text-mute transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg" />
      </div>
    </Link>
  );
}
