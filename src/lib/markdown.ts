import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/** Renders trusted (admin-authored) markdown to HTML. */
export function renderMarkdown(md: string): string {
  return marked.parse(md ?? "", { async: false }) as string;
}

export function wordCount(md: string): number {
  return (md ?? "")
    .replace(/[#>*_`\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(md: string): number {
  return Math.max(1, Math.round(wordCount(md) / 200));
}

/** First paragraph, stripped of markdown, for excerpts. */
export function excerptFrom(md: string, max = 180): string {
  const para = (md ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith("#") && !p.startsWith(">") && !p.startsWith("-") && !p.startsWith("1."));
  const text = (para ?? "").replace(/[*_`#>\[\]]/g, "");
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
