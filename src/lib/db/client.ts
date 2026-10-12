import "server-only";
import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { randomUUID, scryptSync, randomBytes } from "node:crypto";
import { clients as seedClients } from "@/data/clients";
import { seedArticles } from "@/data/research";
import { site, socials as seedSocials } from "@/data/site";

/**
 * Database access. Local development uses a SQLite file; production can point
 * DATABASE_URL at a hosted libsql/Turso instance (with DATABASE_AUTH_TOKEN).
 * Migrations are idempotent and run once per process on first use.
 */

const g = globalThis as unknown as { __aisonDb?: Client; __aisonReady?: Promise<void> };

function connect(): Client {
  const url = process.env.DATABASE_URL ?? "file:./db/aison.db";
  if (url.startsWith("file:")) {
    try {
      mkdirSync("./db", { recursive: true });
    } catch {
      /* ignore */
    }
  }
  return createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
}

export function db(): Client {
  if (!g.__aisonDb) g.__aisonDb = connect();
  return g.__aisonDb;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
    password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]',
    cover_url TEXT, author TEXT NOT NULL DEFAULT 'Aison Labs', status TEXT NOT NULL DEFAULT 'draft',
    published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, number TEXT NOT NULL DEFAULT '', title TEXT NOT NULL,
    dek TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft', published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, team TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '', type TEXT NOT NULL DEFAULT 'Full-time', summary TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft', apply_email TEXT,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'service',
    product TEXT, descriptor TEXT, case_summary TEXT, case_scope TEXT NOT NULL DEFAULT '[]', case_href TEXT,
    seed INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, organization TEXT NOT NULL DEFAULT '', email TEXT NOT NULL,
    intent TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '', source TEXT NOT NULL DEFAULT 'website',
    status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS lead_notes (
    id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, body TEXT NOT NULL, author TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY, job_id TEXT, job_title TEXT NOT NULL DEFAULT '', name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '', links TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status, published_at)`,
  `CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, published_at)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_id)`,
  `CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status, created_at)`,
];

export function hashPasswordSync(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export const DEFAULT_ADMIN = { email: "admin@aisonlabs.local", password: "aisonlabs" };

async function migrate(c: Client) {
  for (const sql of SCHEMA) await c.execute(sql);
}

async function seed(c: Client) {
  const now = new Date().toISOString();

  const users = await c.execute("SELECT COUNT(*) AS n FROM users");
  if (Number(users.rows[0].n) === 0) {
    const email = process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN.email;
    const password = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN.password;
    await c.execute({
      sql: "INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES (?, ?, ?, ?, 'admin', ?)",
      args: [randomUUID(), email.toLowerCase(), "Aison Labs", hashPasswordSync(password), now],
    });
  }

  const settings = await c.execute("SELECT COUNT(*) AS n FROM settings");
  if (Number(settings.rows[0].n) === 0) {
    const defaults: Record<string, string> = {
      site_url: site.url,
      contact_email: site.email,
      social_linkedin: seedSocials.find((s) => s.label === "LinkedIn")?.href ?? "",
      social_x: seedSocials.find((s) => s.label === "X")?.href ?? "",
      social_instagram: seedSocials.find((s) => s.label === "Instagram")?.href ?? "",
      social_github: seedSocials.find((s) => s.label === "GitHub")?.href ?? "",
      careers_email: "",
    };
    for (const [key, value] of Object.entries(defaults)) {
      await c.execute({ sql: "INSERT INTO settings (key, value) VALUES (?, ?)", args: [key, value] });
    }
  }

  const clients = await c.execute("SELECT COUNT(*) AS n FROM clients");
  if (Number(clients.rows[0].n) === 0) {
    let i = 0;
    for (const cl of seedClients) {
      await c.execute({
        sql: `INSERT INTO clients (id, slug, name, kind, product, descriptor, case_summary, case_scope, case_href, seed, sort_order, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomUUID(), cl.slug, cl.name, cl.kind, cl.product ?? null, cl.descriptor,
          cl.caseStudy?.summary ?? null, JSON.stringify(cl.caseStudy?.scope ?? []), cl.caseStudy?.href ?? null,
          cl.seed, i++, now,
        ],
      });
    }
  }

  const articles = await c.execute("SELECT COUNT(*) AS n FROM articles");
  if (Number(articles.rows[0].n) === 0) {
    for (const a of seedArticles()) {
      await c.execute({
        sql: `INSERT INTO articles (id, slug, number, title, dek, category, content, status, published_at, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [randomUUID(), a.slug, a.number, a.title, a.dek, a.category, a.markdown, a.status, a.date, now, now],
      });
    }
  }
}

/** Ensures schema and seed data exist. Safe to call from every request. */
export function ready(): Promise<void> {
  if (!g.__aisonReady) {
    const c = db();
    g.__aisonReady = migrate(c)
      .then(() => seed(c))
      .catch((err) => {
        g.__aisonReady = undefined;
        throw err;
      });
  }
  return g.__aisonReady;
}

export const nowIso = () => new Date().toISOString();
export const newId = () => randomUUID();
