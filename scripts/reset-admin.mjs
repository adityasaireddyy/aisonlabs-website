// Set (or create) the admin login in whatever database the environment points at.
// Usage (values come from the environment, never from the command line history):
//   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... node scripts/reset-admin.mjs
import { createClient } from "@libsql/client";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";

const url = process.env.DATABASE_URL ?? "file:./db/aison.db";
const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";

if (!email || password.length < 8) {
  console.error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters.");
  process.exit(1);
}

const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
const salt = randomBytes(16).toString("hex");
const hash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;

// The tables are created by the site on its first request; fail clearly if that has not happened yet.
try {
  await db.execute("SELECT 1 FROM users LIMIT 1");
} catch {
  console.error("The users table does not exist yet. Open the live site once so it creates the tables, then run this again.");
  process.exit(1);
}

const existing = await db.execute("SELECT id, email FROM users");
console.log(`Existing admin accounts: ${existing.rows.map((r) => r.email).join(", ") || "none"}`);

const same = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
if (same.rows[0]) {
  await db.execute({ sql: "UPDATE users SET password_hash = ? WHERE email = ?", args: [hash, email] });
  console.log(`Password updated for ${email}.`);
} else {
  await db.execute({
    sql: "INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES (?, ?, ?, ?, 'admin', ?)",
    args: [randomUUID(), email, "Aison Labs", hash, new Date().toISOString()],
  });
  console.log(`Admin account created for ${email}.`);
}
