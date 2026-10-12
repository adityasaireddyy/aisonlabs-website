import { NextResponse } from "next/server";
import { createApplication } from "@/lib/db/crm";
import { getJobById } from "@/lib/db/content";

/**
 * Job application endpoint. Stores the application in the CRM
 * (/admin/applications) and forwards it to CONTACT_WEBHOOK_URL if set.
 * Attachments are deliberately links (portfolio, CV URL) rather than uploads.
 */

const MAX = { name: 120, email: 200, phone: 40, links: 600, message: 5000 };
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true });

  const jobId = clean(body.jobId, 64) || null;
  const job = jobId ? await getJobById(jobId) : null;
  const data = {
    jobId: job?.id ?? null,
    jobTitle: job?.title ?? clean(body.jobTitle, 160) ?? "Open application",
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    links: clean(body.links, MAX.links),
    message: clean(body.message, MAX.message),
  };

  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ ok: false, error: "Name, email and a short note are required." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ ok: false, error: "That email address does not look right." }, { status: 422 });
  }

  try {
    const app = await createApplication(data);
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "website/careers", applicationId: app.id, receivedAt: app.createdAt, ...data }),
      }).catch((err) => console.error("[careers] webhook failed:", err));
    }
    return NextResponse.json({ ok: true, id: app.id });
  } catch (err) {
    console.error("[careers] failed to store application:", err);
    return NextResponse.json({ ok: false, error: "We could not save your application. Please email us directly." }, { status: 500 });
  }
}
