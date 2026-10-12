import Link from "next/link";
import type { Post } from "@/lib/db/content";
import { formatDate, readingTime } from "@/lib/markdown";
import { ArrowIcon } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { categoryIcon } from "@/data/icons";
import { cn } from "@/lib/utils";

/** Blog post card. The featured variant spans the row and shows the cover when there is one. */
export default function PostCard({ post, featured, className }: { post: Post; featured?: boolean; className?: string }) {
  const meta = `${formatDate(post.publishedAt)} · ${readingTime(post.content)} min read`;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className={cn("card card-hover group grid overflow-hidden md:grid-cols-2", className)}>
        <div className="flex flex-col p-6 md:p-10">
          <p className="label text-accent">Latest{post.category ? ` · ${post.category}` : ""}</p>
          <h2 className="h2 mt-3">{post.title}</h2>
          {post.excerpt && <p className="lead mt-4 line-clamp-4">{post.excerpt}</p>}
          <div className="mt-auto flex items-center justify-between pt-8">
            <span className="label">{meta}</span>
            <span className="inline-flex items-center gap-1.5 text-[14px] font-medium">
              Read <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverUrl} alt="" className="h-full min-h-[14rem] w-full object-cover" loading="lazy" />
        ) : (
          <div aria-hidden="true" className="tone-soft hidden min-h-[14rem] items-center justify-center border-l border-line md:flex">
            <span className="text-[clamp(3rem,7vw,5.5rem)] font-semibold tracking-[-0.04em] text-fg/[0.07]">Blog</span>
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className={cn("card card-hover group flex h-full flex-col p-6", className)}>
      {post.category && (
        <p className="label flex items-center gap-2 text-accent">
          <Icon name={categoryIcon(post.category)} size={18} />
          {post.category}
        </p>
      )}
      <h3 className="h3 mt-3 text-balance">{post.title}</h3>
      {post.excerpt && <p className="small mt-3 line-clamp-3 text-mute">{post.excerpt}</p>}
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="label">{meta}</span>
        <ArrowIcon className="text-mute transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg" />
      </div>
    </Link>
  );
}
