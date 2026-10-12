import "server-only";
import { db, ready, newId, nowIso } from "@/lib/db/client";

/* ------------------------------------------------------------------ */
/* CRM: leads (contact form + manual), notes, job applications         */
/* ------------------------------------------------------------------ */

export const LEAD_STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const APPLICATION_STATUSES = ["new", "reviewing", "interview", "offer", "hired", "declined"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Lead = {
  id: string; name: string; organization: string; email: string; intent: string; message: string;
  source: string; status: LeadStatus; createdAt: string; updatedAt: string;
};
export type LeadInput = Pick<Lead, "name" | "organization" | "email" | "intent" | "message"> & { source?: string; status?: LeadStatus };

export type LeadNote = { id: string; leadId: string; body: string; author: string; createdAt: string };

export type Application = {
  id: string; jobId: string | null; jobTitle: string; name: string; email: string; phone: string; links: string;
  message: string; status: ApplicationStatus; createdAt: string; updatedAt: string;
};
export type ApplicationInput = Pick<Application, "jobId" | "jobTitle" | "name" | "email" | "phone" | "links" | "message">;

type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v));

function toLead(r: Row): Lead {
  return {
    id: s(r.id), name: s(r.name), organization: s(r.organization), email: s(r.email), intent: s(r.intent),
    message: s(r.message), source: s(r.source), status: (s(r.status) as LeadStatus) || "new",
    createdAt: s(r.created_at), updatedAt: s(r.updated_at),
  };
}

export async function createLead(input: LeadInput): Promise<Lead> {
  await ready();
  const id = newId();
  const now = nowIso();
  await db().execute({
    sql: `INSERT INTO leads (id, name, organization, email, intent, message, source, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, input.name, input.organization, input.email, input.intent, input.message, input.source ?? "website", input.status ?? "new", now, now],
  });
  return (await getLead(id))!;
}

export async function listLeads(opts: { status?: LeadStatus | "all"; q?: string } = {}): Promise<Lead[]> {
  await ready();
  const clauses: string[] = [];
  const args: string[] = [];
  if (opts.status && opts.status !== "all") {
    clauses.push("status = ?");
    args.push(opts.status);
  }
  if (opts.q) {
    clauses.push("(name LIKE ? OR organization LIKE ? OR email LIKE ? OR message LIKE ?)");
    const like = `%${opts.q}%`;
    args.push(like, like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const res = await db().execute({ sql: `SELECT * FROM leads ${where} ORDER BY created_at DESC`, args });
  return res.rows.map((r) => toLead(r as Row));
}

export async function getLead(id: string): Promise<Lead | null> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM leads WHERE id = ?", args: [id] });
  return res.rows[0] ? toLead(res.rows[0] as Row) : null;
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, "name" | "organization" | "email" | "intent" | "message" | "status" | "source">>) {
  await ready();
  const existing = await getLead(id);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  await db().execute({
    sql: `UPDATE leads SET name=?, organization=?, email=?, intent=?, message=?, source=?, status=?, updated_at=? WHERE id=?`,
    args: [next.name, next.organization, next.email, next.intent, next.message, next.source, next.status, nowIso(), id],
  });
  return getLead(id);
}

export async function deleteLead(id: string) {
  await ready();
  await db().execute({ sql: "DELETE FROM lead_notes WHERE lead_id = ?", args: [id] });
  await db().execute({ sql: "DELETE FROM leads WHERE id = ?", args: [id] });
}

export async function addLeadNote(leadId: string, body: string, author: string): Promise<LeadNote> {
  await ready();
  const id = newId();
  const now = nowIso();
  await db().execute({ sql: "INSERT INTO lead_notes (id, lead_id, body, author, created_at) VALUES (?, ?, ?, ?, ?)", args: [id, leadId, body, author, now] });
  await db().execute({ sql: "UPDATE leads SET updated_at = ? WHERE id = ?", args: [now, leadId] });
  return { id, leadId, body, author, createdAt: now };
}

export async function listLeadNotes(leadId: string): Promise<LeadNote[]> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC", args: [leadId] });
  return res.rows.map((r) => ({ id: s(r.id), leadId: s(r.lead_id), body: s(r.body), author: s(r.author), createdAt: s(r.created_at) }));
}

function toApplication(r: Row): Application {
  return {
    id: s(r.id), jobId: r.job_id == null ? null : s(r.job_id), jobTitle: s(r.job_title), name: s(r.name), email: s(r.email),
    phone: s(r.phone), links: s(r.links), message: s(r.message), status: (s(r.status) as ApplicationStatus) || "new",
    createdAt: s(r.created_at), updatedAt: s(r.updated_at),
  };
}

export async function createApplication(input: ApplicationInput): Promise<Application> {
  await ready();
  const id = newId();
  const now = nowIso();
  await db().execute({
    sql: `INSERT INTO applications (id, job_id, job_title, name, email, phone, links, message, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
    args: [id, input.jobId, input.jobTitle, input.name, input.email, input.phone, input.links, input.message, now, now],
  });
  return (await getApplication(id))!;
}

export async function listApplications(opts: { status?: ApplicationStatus | "all"; jobId?: string } = {}): Promise<Application[]> {
  await ready();
  const clauses: string[] = [];
  const args: string[] = [];
  if (opts.status && opts.status !== "all") {
    clauses.push("status = ?");
    args.push(opts.status);
  }
  if (opts.jobId) {
    clauses.push("job_id = ?");
    args.push(opts.jobId);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const res = await db().execute({ sql: `SELECT * FROM applications ${where} ORDER BY created_at DESC`, args });
  return res.rows.map((r) => toApplication(r as Row));
}

export async function getApplication(id: string): Promise<Application | null> {
  await ready();
  const res = await db().execute({ sql: "SELECT * FROM applications WHERE id = ?", args: [id] });
  return res.rows[0] ? toApplication(res.rows[0] as Row) : null;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  await ready();
  await db().execute({ sql: "UPDATE applications SET status = ?, updated_at = ? WHERE id = ?", args: [status, nowIso(), id] });
}

export async function deleteApplication(id: string) {
  await ready();
  await db().execute({ sql: "DELETE FROM applications WHERE id = ?", args: [id] });
}

export async function crmCounts() {
  await ready();
  const q = async (sql: string) => Number((await db().execute(sql)).rows[0].n);
  return {
    leads: await q("SELECT COUNT(*) AS n FROM leads"),
    leadsNew: await q("SELECT COUNT(*) AS n FROM leads WHERE status='new'"),
    leadsWon: await q("SELECT COUNT(*) AS n FROM leads WHERE status='won'"),
    applications: await q("SELECT COUNT(*) AS n FROM applications"),
    applicationsNew: await q("SELECT COUNT(*) AS n FROM applications WHERE status='new'"),
  };
}

export function leadsToCsv(rows: Lead[]): string {
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const head = ["id", "created_at", "status", "name", "organization", "email", "intent", "message", "source"];
  const lines = rows.map((l) => [l.id, l.createdAt, l.status, l.name, l.organization, l.email, l.intent, l.message, l.source].map(esc).join(","));
  return [head.join(","), ...lines].join("\n");
}
