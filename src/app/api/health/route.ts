import { NextResponse } from "next/server";
import { db, ready } from "@/lib/db/client";

export const dynamic = "force-dynamic";

/** Setup check: reports which pieces of configuration are in place. Never returns secret values. */
export async function GET() {
  const secret = process.env.AUTH_SECRET;
  const url = process.env.DATABASE_URL ?? "file:./db/aison.db";
  const result: Record<string, unknown> = {
    authSecret: secret ? (secret.length >= 16 ? "ok" : "too short (needs 16+ characters)") : "missing",
    databaseUrl: url.startsWith("libsql:") || url.startsWith("https:") ? "hosted" : "local file (not suitable for Vercel)",
    databaseToken: process.env.DATABASE_AUTH_TOKEN ? "set" : "missing",
    adminEmail: process.env.ADMIN_EMAIL ? "set" : "not set (default admin will be used)",
  };
  try {
    await ready();
    const r = await db().execute("SELECT COUNT(*) AS n FROM users");
    result.database = "ok";
    result.adminAccounts = Number(r.rows[0].n);
  } catch (e) {
    result.database = "error";
    result.databaseError = e instanceof Error ? e.message.slice(0, 160).replace(/(token|bearer)\S*/gi, "[hidden]") : "unknown";
  }
  return NextResponse.json(result, { status: result.database === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
