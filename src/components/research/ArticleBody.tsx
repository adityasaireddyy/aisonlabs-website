import { renderMarkdown } from "@/lib/markdown";

/** Renders admin-authored markdown with the editorial prose styles. */
export default function ArticleBody({ markdown, className }: { markdown: string; className?: string }) {
  return <div className={["prose", className].filter(Boolean).join(" ")} dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />;
}
