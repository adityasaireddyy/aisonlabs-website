import { NextResponse } from "next/server";
import { createLead } from "@/lib/db/crm";

/**
 * Contact endpoint.
 * 1. Validates the payload (with a honeypot for bots).
 * 2. Stores the enquiry as a lead in the CRM (/admin/leads).
 * 3. Forwards it to CONTACT_WEBHOOK_URL when configured (email service,
 *    Slack, CRM, automation tool). The webhook is best-effort: the lead is
 *    already saved even if the webhook fails.
 */

type Payload = {
  name: string;
  organization: string;
  email: string;
  intent: string;
  message: string;
  website?: string; // honeypot
};

const MAX = { name: 120, organization: 160, email: 200, intent: 80, message: 4000 };

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Partial<Payload>;
  try {
    body = (await req.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true });

  const data: Payload = {
    name: clean(body.name, MAX.name),
    organization: clean(body.organization, MAX.organization),
    email: clean(body.email, MAX.email),
    intent: clean(body.intent, MAX.intent),
    message: clean(body.message, MAX.message),
  };

  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ ok: false, error: "Name, email and message are required." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ ok: false, error: "That email address does not look right." }, { status: 422 });
  }

  let leadId: string | null = null;
  try {
    const lead = await createLead({ ...data, source: "website" });
    leadId = lead.id;
  } catch (err) {
    console.error("[contact] failed to store lead:", err);
    return NextResponse.json({ ok: false, error: "We could not save your message. Please email us directly." }, { status: 500 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "website/contact", leadId, receivedAt: new Date().toISOString(), ...data }),
      });
      if (!res.ok) console.error(`[contact] webhook responded ${res.status}`);
    } catch (err) {
      console.error("[contact] webhook failed:", err);
    }
  }

  return NextResponse.json({ ok: true, id: leadId });
}
