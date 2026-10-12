import "server-only";
import { db, ready, newId, nowIso } from "@/lib/db/client";
import type { Client as ClientView } from "@/data/clients";
import { slugify } from "@/lib/markdown";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type PostStatus = "draft" | "published";
export type Post = {
  id: string; slug: string; title: string; excerpt: string; content: string; category: string;
  tags: string[]; coverUrl: string | null; author: string; status: PostStatus; publishedAt: string | null;
  createdAt: string; updatedAt: string;
};
export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

export type Article = {
  id: string; slug: string; number: string; title: string; dek: string; category: string; content: string;
  status: PostStatus; publishedAt: string | null; createdAt: string; updatedAt: string;
};
export type ArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;

export type JobStatus = "draft" | "open" | "closed";
export type Job = {
  id: string; slug: string; title: string; team: string; location: string; type: string; summary: string;
  content: string; status: JobStatus; applyEmail: string | null; createdAt: string; updatedAt: string;
};
export type JobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;

export type ClientRecord = {
  id: string; slug: string; name: string; kind: "service" | "product-deployment"; product: string | null;
  descriptor: string | null; caseSummary: string | null; caseScope: string[]; caseHref: string | null;
  seed: number; sortOrder: number; createdAt: string;
};
export type ClientInput = Omit<ClientRecord, "id" | "createdAt">;

export type Settings = {
  siteUrl: string; contactEmail: string; careersEmail: string;
  socials: { linkedin: string; x: string; instagram: string; github: string };
};

type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v));
const sn = (v: unknown) => (v == null ? null : String(v));
const json = (v: unknown): string[] => {
  try {
    const parsed = JSON.parse(s(v) || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

/* ------------------------------------------------------------------ */
/* Posts (blog)                                                        */
/* ------------------------------------------------------------------ */

function toPost(r: Row): Post {
  return {
    id: s(r.id), slug: s(r.slug), title: s(r.title), excerpt: s(r.excerpt), content: s(r.content),
    category: s(r.category), tags: json(r.tags), coverUrl: sn(r.cover_url), author: s(r.author),
    status: (s(r.status) as PostStatus) || "draft", publishedAt: sn(r.published_at),
    createdAt: s(r.created_at), updatedAt: s(r.updated_at),
  };
}

export async function listPosts(opts: { status?: PostStatus; limit?: number } = {}): Promise<Post[]> {
  await ready();
  const where = opts.status ? "WHERE status = ?" : "";
  const args: (string | number)[] = opts.status ? [opts.status] : [];
  const limit = opts.limit ? ` LIMIT ${Number(opts.limit)}` : "";
  const res = await db().execute({ sql: `SELECT * FROM posts ${where} ORDER BY COALESCE(published_at, created_at) DESC${limit}`, args });
  return res.rows.map((r) => toPost(r as Row));
}

export async function getPost(slug: string, publishedOnly = true): Promise<Post | null> {
  await ready();
  const res = await db().execute({ sql: `SELECT * FROM posts WHERE slug = ? ${publishedOnly ? "AND status = 'published'" : ""}`, args: [slug] });
  return res.rows[0] ? toPost(res.rows[0] as Row) : null;
}

export async function getPostById(id: string): Promise<Post | null> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM posts WHERE id = ?", args: [id] });
  return res.rows[0] ? toPost(res.rows[0] as Row) : null;
}

async function uniqueSlug(table: "posts" | "articles" | "jobs" | "clients", base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "untitled";
  let candidate = root;
  for (let i = 2; i < 100; i++) {
    const res = await db().execute({ sql: `SELECT id FROM ${table} WHERE slug = ? ${excludeId ? "AND id != ?" : ""}`, args: excludeId ? [candidate, excludeId] : [candidate] });
    if (res.rows.length === 0) return candidate;
    candidate = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}

export async function createPost(input: PostInput): Promise<Post> {
  await ready();
  const id = newId();
  const now = nowIso();
  const slug = await uniqueSlug("posts", input.slug || input.title);
  await db().execute({
    sql: `INSERT INTO posts (id, slug, title, excerpt, content, category, tags, cover_url, author, status, published_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, slug, input.title, input.excerpt, input.content, input.category, JSON.stringify(input.tags), input.coverUrl, input.author, input.status,
      input.status === "published" ? (input.publishedAt ?? now) : input.publishedAt, now, now],
  });
  return (await getPostById(id))!;
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
  await ready();
  const slug = await uniqueSlug("posts", input.slug || input.title, id);
  const existing = await getPostById(id);
  const publishedAt = input.status === "published" ? (input.publishedAt ?? existing?.publishedAt ?? nowIso()) : input.publishedAt;
  await db().execute({
    sql: `UPDATE posts SET slug=?, title=?, excerpt=?, content=?, category=?, tags=?, cover_url=?, author=?, status=?, published_at=?, updated_at=? WHERE id=?`,
    args: [slug, input.title, input.excerpt, input.content, input.category, JSON.stringify(input.tags), input.coverUrl, input.author, input.status, publishedAt, nowIso(), id],
  });
  return (await getPostById(id))!;
}

export async function deletePost(id: string) {
  await ready();
  await db().execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
}

/* ------------------------------------------------------------------ */
/* Articles (research)                                                 */
/* ------------------------------------------------------------------ */

function toArticle(r: Row): Article {
  return {
    id: s(r.id), slug: s(r.slug), number: s(r.number), title: s(r.title), dek: s(r.dek), category: s(r.category),
    content: s(r.content), status: (s(r.status) as PostStatus) || "draft", publishedAt: sn(r.published_at),
    createdAt: s(r.created_at), updatedAt: s(r.updated_at),
  };
}

export async function listArticles(opts: { status?: PostStatus; limit?: number } = {}): Promise<Article[]> {
  await ready();
  const where = opts.status ? "WHERE status = ?" : "";
  const args: string[] = opts.status ? [opts.status] : [];
  const limit = opts.limit ? ` LIMIT ${Number(opts.limit)}` : "";
  const res = await db().execute({ sql: `SELECT * FROM articles ${where} ORDER BY COALESCE(published_at, created_at) DESC${limit}`, args });
  return res.rows.map((r) => toArticle(r as Row));
}

export async function getArticle(slug: string, publishedOnly = true): Promise<Article | null> {
  await ready();
  const res = await db().execute({ sql: `SELECT * FROM articles WHERE slug = ? ${publishedOnly ? "AND status = 'published'" : ""}`, args: [slug] });
  return res.rows[0] ? toArticle(res.rows[0] as Row) : null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM articles WHERE id = ?", args: [id] });
  return res.rows[0] ? toArticle(res.rows[0] as Row) : null;
}

export async function nextArticleNumber(): Promise<string> {
  await ready();
  const res = await db().execute("SELECT COUNT(*) AS n FROM articles");
  return String(Number(res.rows[0].n) + 1).padStart(3, "0");
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  await ready();
  const id = newId();
  const now = nowIso();
  const slug = await uniqueSlug("articles", input.slug || input.title);
  const number = input.number || (await nextArticleNumber());
  await db().execute({
    sql: `INSERT INTO articles (id, slug, number, title, dek, category, content, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, slug, number, input.title, input.dek, input.category, input.content, input.status,
      input.status === "published" ? (input.publishedAt ?? now) : input.publishedAt, now, now],
  });
  return (await getArticleById(id))!;
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  await ready();
  const slug = await uniqueSlug("articles", input.slug || input.title, id);
  const existing = await getArticleById(id);
  const publishedAt = input.status === "published" ? (input.publishedAt ?? existing?.publishedAt ?? nowIso()) : input.publishedAt;
  await db().execute({
    sql: `UPDATE articles SET slug=?, number=?, title=?, dek=?, category=?, content=?, status=?, published_at=?, updated_at=? WHERE id=?`,
    args: [slug, input.number, input.title, input.dek, input.category, input.content, input.status, publishedAt, nowIso(), id],
  });
  return (await getArticleById(id))!;
}

export async function deleteArticle(id: string) {
  await ready();
  await db().execute({ sql: "DELETE FROM articles WHERE id = ?", args: [id] });
}

/* ------------------------------------------------------------------ */
/* Jobs (careers)                                                      */
/* ------------------------------------------------------------------ */

function toJob(r: Row): Job {
  return {
    id: s(r.id), slug: s(r.slug), title: s(r.title), team: s(r.team), location: s(r.location), type: s(r.type),
    summary: s(r.summary), content: s(r.content), status: (s(r.status) as JobStatus) || "draft",
    applyEmail: sn(r.apply_email), createdAt: s(r.created_at), updatedAt: s(r.updated_at),
  };
}

export async function listJobs(opts: { status?: JobStatus } = {}): Promise<Job[]> {
  await ready();
  const where = opts.status ? "WHERE status = ?" : "";
  const args: string[] = opts.status ? [opts.status] : [];
  const res = await db().execute({ sql: `SELECT * FROM jobs ${where} ORDER BY created_at DESC`, args });
  return res.rows.map((r) => toJob(r as Row));
}

export async function getJob(slug: string, openOnly = true): Promise<Job | null> {
  await ready();
  const res = await db().execute({ sql: `SELECT * FROM jobs WHERE slug = ? ${openOnly ? "AND status = 'open'" : ""}`, args: [slug] });
  return res.rows[0] ? toJob(res.rows[0] as Row) : null;
}

export async function getJobById(id: string): Promise<Job | null> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM jobs WHERE id = ?", args: [id] });
  return res.rows[0] ? toJob(res.rows[0] as Row) : null;
}

export async function createJob(input: JobInput): Promise<Job> {
  await ready();
  const id = newId();
  const now = nowIso();
  const slug = await uniqueSlug("jobs", input.slug || input.title);
  await db().execute({
    sql: `INSERT INTO jobs (id, slug, title, team, location, type, summary, content, status, apply_email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, slug, input.title, input.team, input.location, input.type, input.summary, input.content, input.status, input.applyEmail, now, now],
  });
  return (await getJobById(id))!;
}

export async function updateJob(id: string, input: JobInput): Promise<Job> {
  await ready();
  const slug = await uniqueSlug("jobs", input.slug || input.title, id);
  await db().execute({
    sql: `UPDATE jobs SET slug=?, title=?, team=?, location=?, type=?, summary=?, content=?, status=?, apply_email=?, updated_at=? WHERE id=?`,
    args: [slug, input.title, input.team, input.location, input.type, input.summary, input.content, input.status, input.applyEmail, nowIso(), id],
  });
  return (await getJobById(id))!;
}

export async function deleteJob(id: string) {
  await ready();
  await db().execute({ sql: "DELETE FROM jobs WHERE id = ?", args: [id] });
}

/* ------------------------------------------------------------------ */
/* Clients                                                             */
/* ------------------------------------------------------------------ */

function toClient(r: Row): ClientRecord {
  return {
    id: s(r.id), slug: s(r.slug), name: s(r.name), kind: (s(r.kind) as ClientRecord["kind"]) || "service",
    product: sn(r.product), descriptor: sn(r.descriptor), caseSummary: sn(r.case_summary), caseScope: json(r.case_scope),
    caseHref: sn(r.case_href), seed: Number(r.seed ?? 1), sortOrder: Number(r.sort_order ?? 0), createdAt: s(r.created_at),
  };
}

export async function listClients(): Promise<ClientRecord[]> {
  await ready();
  const res = await db().execute("SELECT * FROM clients ORDER BY sort_order ASC, created_at ASC");
  return res.rows.map((r) => toClient(r as Row));
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM clients WHERE id = ?", args: [id] });
  return res.rows[0] ? toClient(res.rows[0] as Row) : null;
}

export async function createClient(input: ClientInput): Promise<ClientRecord> {
  await ready();
  const id = newId();
  const slug = await uniqueSlug("clients", input.slug || input.name);
  await db().execute({
    sql: `INSERT INTO clients (id, slug, name, kind, product, descriptor, case_summary, case_scope, case_href, seed, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, slug, input.name, input.kind, input.product, input.descriptor, input.caseSummary, JSON.stringify(input.caseScope), input.caseHref, input.seed, input.sortOrder, nowIso()],
  });
  return (await getClientById(id))!;
}

export async function updateClient(id: string, input: ClientInput): Promise<ClientRecord> {
  await ready();
  const slug = await uniqueSlug("clients", input.slug || input.name, id);
  await db().execute({
    sql: `UPDATE clients SET slug=?, name=?, kind=?, product=?, descriptor=?, case_summary=?, case_scope=?, case_href=?, seed=?, sort_order=? WHERE id=?`,
    args: [slug, input.name, input.kind, input.product, input.descriptor, input.caseSummary, JSON.stringify(input.caseScope), input.caseHref, input.seed, input.sortOrder, id],
  });
  return (await getClientById(id))!;
}

export async function deleteClient(id: string) {
  await ready();
  await db().execute({ sql: "DELETE FROM clients WHERE id = ?", args: [id] });
}

/** Shape used by the marketing components (ClientList, ClientWall). */
export function toClientView(c: ClientRecord): ClientView {
  return {
    slug: c.slug,
    name: c.name,
    kind: c.kind,
    product: c.product ?? undefined,
    descriptor: c.descriptor,
    caseStudy: c.caseSummary || c.caseHref ? { summary: c.caseSummary ?? "", scope: c.caseScope, href: c.caseHref ?? undefined } : null,
    seed: c.seed,
  };
}

export async function listClientViews(): Promise<ClientView[]> {
  return (await listClients()).map(toClientView);
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export async function getSettings(): Promise<Settings> {
  await ready();
  const res = await db().execute("SELECT key, value FROM settings");
  const m = new Map(res.rows.map((r) => [s(r.key), s(r.value)]));
  return {
    siteUrl: m.get("site_url") || "",
    contactEmail: m.get("contact_email") || "",
    careersEmail: m.get("careers_email") || "",
    socials: {
      linkedin: m.get("social_linkedin") || "",
      x: m.get("social_x") || "",
      instagram: m.get("social_instagram") || "",
      github: m.get("social_github") || "",
    },
  };
}

export async function updateSettings(next: Settings) {
  await ready();
  const entries: [string, string][] = [
    ["site_url", next.siteUrl], ["contact_email", next.contactEmail], ["careers_email", next.careersEmail],
    ["social_linkedin", next.socials.linkedin], ["social_x", next.socials.x],
    ["social_instagram", next.socials.instagram], ["social_github", next.socials.github],
  ];
  for (const [key, value] of entries) {
    await db().execute({ sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", args: [key, value.trim()] });
  }
}

export async function contentCounts() {
  await ready();
  const q = async (sql: string) => Number((await db().execute(sql)).rows[0].n);
  return {
    posts: await q("SELECT COUNT(*) AS n FROM posts"),
    postsPublished: await q("SELECT COUNT(*) AS n FROM posts WHERE status='published'"),
    articles: await q("SELECT COUNT(*) AS n FROM articles"),
    jobsOpen: await q("SELECT COUNT(*) AS n FROM jobs WHERE status='open'"),
    clients: await q("SELECT COUNT(*) AS n FROM clients"),
  };
}
