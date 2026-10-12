import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { db, ready, hashPasswordSync } from "@/lib/db/client";

/**
 * Minimal, dependency-free admin auth.
 * Passwords: scrypt with per-user salt. Sessions: HMAC-signed cookie token.
 */

export const SESSION_COOKIE = "aison_session";
const SESSION_DAYS = 7;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set (16+ chars) in production.");
  }
  return "aison-dev-secret-change-me";
}

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");

export type SessionPayload = { uid: string; email: string; name: string; exp: number };

export function signToken(payload: SessionPayload): string {
  const body = b64(JSON.stringify(payload));
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(unb64(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export { hashPasswordSync as hashPassword };

export async function login(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await ready();
  const res = await db().execute({ sql: "SELECT id, email, name, password_hash FROM users WHERE email = ?", args: [email.trim().toLowerCase()] });
  const row = res.rows[0];
  if (!row || !verifyPassword(password, String(row.password_hash))) {
    return { ok: false, error: "Email or password is incorrect." };
  }
  const payload: SessionPayload = {
    uid: String(row.id),
    email: String(row.email),
    name: String(row.name),
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signToken(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function changePassword(uid: string, current: string, next: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await ready();
  const res = await db().execute({ sql: "SELECT password_hash FROM users WHERE id = ?", args: [uid] });
  const row = res.rows[0];
  if (!row || !verifyPassword(current, String(row.password_hash))) return { ok: false, error: "Current password is incorrect." };
  if (next.length < 10) return { ok: false, error: "New password must be at least 10 characters." };
  await db().execute({ sql: "UPDATE users SET password_hash = ? WHERE id = ?", args: [hashPasswordSync(next), uid] });
  return { ok: true };
}

export async function usingDefaultPassword(uid: string): Promise<boolean> {
  await ready();
  const res = await db().execute({ sql: "SELECT password_hash FROM users WHERE id = ?", args: [uid] });
  const row = res.rows[0];
  if (!row) return false;
  return !process.env.ADMIN_PASSWORD && verifyPassword("aisonlabs", String(row.password_hash));
}
