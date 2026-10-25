"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changePassword, login, logout, requireAdmin } from "@/lib/auth";
import * as content from "@/lib/db/content";
import * as crm from "@/lib/db/crm";

export type ActionState = { error?: string; ok?: boolean; message?: string } | null;

const str = (fd: FormData, key: string, max = 20000) => String(fd.get(key) ?? "").trim().slice(0, max);
const opt = (fd: FormData, key: string, max = 2000) => str(fd, key, max) || null;
const dateOrNull = (fd: FormData, key: string) => {
  const v = str(fd, key, 40);
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/** Pages are dynamic, but sweep the caches (including the client router cache) so nothing stale survives. */
function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

/* ---------------- Auth ---------------- */

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  let res: Awaited<ReturnType<typeof login>>;
  try {
    res = await login(str(fd, "email", 200), String(fd.get("password") ?? ""));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("AUTH_SECRET")) return { error: "Server setup problem: AUTH_SECRET is not set (16+ characters) in this environment." };
    return { error: "Server setup problem: the database could not be reached or is not set up. Check DATABASE_URL and DATABASE_AUTH_TOKEN." };
  }
  if (!res.ok) return { error: res.error };
  const next = str(fd, "next", 300);
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const next = String(fd.get("next") ?? "");
  if (next !== String(fd.get("confirm") ?? "")) return { error: "New passwords do not match." };
  const res = await changePassword(session.uid, String(fd.get("current") ?? ""), next);
  if (!res.ok) return { error: res.error };
  return { ok: true, message: "Password updated." };
}

/* ---------------- Blog ---------------- */

export async function savePostAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id", 64);
  const input: content.PostInput = {
    slug: str(fd, "slug", 120),
    title: str(fd, "title", 200),
    excerpt: str(fd, "excerpt", 600),
    content: str(fd, "content"),
    category: str(fd, "category", 80),
    tags: str(fd, "tags", 400).split(",").map((t) => t.trim()).filter(Boolean),
    coverUrl: opt(fd, "coverUrl", 600),
    author: str(fd, "author", 120) || "Aison Labs",
    status: str(fd, "status", 20) === "published" ? "published" : "draft",
    publishedAt: dateOrNull(fd, "publishedAt"),
  };
  if (!input.title) return { error: "A title is required." };
  if (id) await content.updatePost(id, input);
  else await content.createPost(input);
  revalidateSite();
  redirect("/admin/blog");
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  await content.deletePost(str(fd, "id", 64));
  revalidateSite();
  redirect("/admin/blog");
}

/* ---------------- Research ---------------- */

export async function saveArticleAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id", 64);
  const input: content.ArticleInput = {
    slug: str(fd, "slug", 120),
    number: str(fd, "number", 10),
    title: str(fd, "title", 200),
    dek: str(fd, "dek", 600),
    category: str(fd, "category", 80),
    content: str(fd, "content"),
    status: str(fd, "status", 20) === "published" ? "published" : "draft",
    publishedAt: dateOrNull(fd, "publishedAt"),
  };
  if (!input.title) return { error: "A title is required." };
  if (id) await content.updateArticle(id, input);
  else await content.createArticle(input);
  revalidateSite();
  redirect("/admin/research");
}

export async function deleteArticleAction(fd: FormData) {
  await requireAdmin();
  await content.deleteArticle(str(fd, "id", 64));
  revalidateSite();
  redirect("/admin/research");
}

/* ---------------- Careers ---------------- */

export async function saveJobAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id", 64);
  const status = str(fd, "status", 20);
  const input: content.JobInput = {
    slug: str(fd, "slug", 120),
    title: str(fd, "title", 200),
    team: str(fd, "team", 80),
    location: str(fd, "location", 120),
    type: str(fd, "type", 60),
    summary: str(fd, "summary", 600),
    content: str(fd, "content"),
    status: status === "open" || status === "closed" ? status : "draft",
    applyEmail: opt(fd, "applyEmail", 200),
  };
  if (!input.title) return { error: "A title is required." };
  if (id) await content.updateJob(id, input);
  else await content.createJob(input);
  revalidateSite();
  redirect("/admin/careers");
}

export async function deleteJobAction(fd: FormData) {
  await requireAdmin();
  await content.deleteJob(str(fd, "id", 64));
  revalidateSite();
  redirect("/admin/careers");
}

/* ---------------- Clients ---------------- */

export async function saveClientAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id", 64);
  const input: content.ClientInput = {
    slug: str(fd, "slug", 120),
    name: str(fd, "name", 160),
    kind: str(fd, "kind", 30) === "product-deployment" ? "product-deployment" : "service",
    product: opt(fd, "product", 120),
    descriptor: opt(fd, "descriptor", 160),
    caseSummary: opt(fd, "caseSummary", 1000),
    caseScope: str(fd, "caseScope", 3000).split("\n").map((s) => s.trim()).filter(Boolean),
    caseHref: opt(fd, "caseHref", 400),
    seed: Number(str(fd, "seed", 10)) || Math.floor(Math.random() * 500) + 1,
    sortOrder: Number(str(fd, "sortOrder", 10)) || 0,
  };
  if (!input.name) return { error: "A name is required." };
  if (id) await content.updateClient(id, input);
  else await content.createClient(input);
  revalidateSite();
  redirect("/admin/clients");
}

export async function deleteClientAction(fd: FormData) {
  await requireAdmin();
  await content.deleteClient(str(fd, "id", 64));
  revalidateSite();
  redirect("/admin/clients");
}

/* ---------------- Settings ---------------- */

export async function saveSettingsAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  await content.updateSettings({
    siteUrl: str(fd, "siteUrl", 300),
    contactEmail: str(fd, "contactEmail", 200),
    careersEmail: str(fd, "careersEmail", 200),
    socials: {
      linkedin: str(fd, "linkedin", 300),
      x: str(fd, "x", 300),
      instagram: str(fd, "instagram", 300),
      github: str(fd, "github", 300),
    },
  });
  revalidateSite();
  return { ok: true, message: "Settings saved." };
}

/* ---------------- CRM: leads ---------------- */

export async function createLeadAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const name = str(fd, "name", 120);
  const email = str(fd, "email", 200);
  if (!name || !email) return { error: "Name and email are required." };
  const lead = await crm.createLead({
    name,
    email,
    organization: str(fd, "organization", 160),
    intent: str(fd, "intent", 80),
    message: str(fd, "message", 4000),
    source: str(fd, "source", 60) || "manual",
    status: (str(fd, "status", 20) as crm.LeadStatus) || "new",
  });
  redirect(`/admin/leads/${lead.id}`);
}

export async function updateLeadAction(fd: FormData) {
  const session = await requireAdmin();
  const id = str(fd, "id", 64);
  const status = str(fd, "status", 20) as crm.LeadStatus;
  const before = await crm.getLead(id);
  await crm.updateLead(id, {
    status: crm.LEAD_STATUSES.includes(status) ? status : undefined,
    name: str(fd, "name", 120) || undefined,
    organization: fd.has("organization") ? str(fd, "organization", 160) : undefined,
    email: str(fd, "email", 200) || undefined,
    intent: fd.has("intent") ? str(fd, "intent", 80) : undefined,
  });
  if (before && crm.LEAD_STATUSES.includes(status) && before.status !== status) {
    await crm.addLeadNote(id, `Status changed from ${before.status} to ${status}.`, session.name);
  }
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function addLeadNoteAction(fd: FormData) {
  const session = await requireAdmin();
  const id = str(fd, "id", 64);
  const body = str(fd, "body", 4000);
  if (body) await crm.addLeadNote(id, body, session.name);
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLeadAction(fd: FormData) {
  await requireAdmin();
  await crm.deleteLead(str(fd, "id", 64));
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

/* ---------------- CRM: applications ---------------- */

export async function updateApplicationAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 64);
  const status = str(fd, "status", 20) as crm.ApplicationStatus;
  if (crm.APPLICATION_STATUSES.includes(status)) await crm.updateApplicationStatus(id, status);
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
}

export async function deleteApplicationAction(fd: FormData) {
  await requireAdmin();
  await crm.deleteApplication(str(fd, "id", 64));
  revalidatePath("/admin/applications");
  redirect("/admin/applications");
}
