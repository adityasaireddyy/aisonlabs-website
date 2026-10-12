// Captures screens from a running Aison Edu instance for use on the website.
// Usage: EDU_USER=... EDU_PASS=... node scripts/edu-capture.mjs <outDir> [scale] [route[=name[@clipHeight]] ...]
// Only capture screens without personal data (no student, guardian, staff or message lists).
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const base = process.env.EDU_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "./public/edu";
const scale = Number(process.argv[3] ?? 1);
const routes = process.argv.slice(4);
mkdirSync(out, { recursive: true });
let browser; try { browser = await chromium.launch({ channel: "msedge" }); } catch { browser = await chromium.launch({ channel: "chrome" }); }
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale });
const page = await ctx.newPage();
const settle = async () => {
  await page.waitForFunction(() => !document.querySelector(".splash"), null, { timeout: 30000 }).catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(900);
};
await page.goto(base + "/login", { waitUntil: "domcontentloaded" });
await settle();
await page.fill("input[name='identifier']", process.env.EDU_USER);
await page.fill("input[name='password']", process.env.EDU_PASS);
await page.click("button[type='submit']");
await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30000 });
await settle();
for (const r of routes) {
  const [path, spec] = r.split("=");
  const [name, clipH] = (spec ?? "").split("@");
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  await settle();
  const slug = name || (path === "/" ? "dashboard" : path.slice(1).split("/").join("-"));
  const file = out + "/" + slug + (scale > 1 ? ".png" : ".jpg");
  const clip = clipH ? { clip: { x: 0, y: 0, width: 1440, height: Number(clipH) } } : {};
  if (clipH && Number(clipH) > 900) { await page.setViewportSize({ width: 1440, height: Number(clipH) }); await page.waitForTimeout(600); }
  else await page.setViewportSize({ width: 1440, height: 900 });
  writeFileSync(file, await page.screenshot(scale > 1 ? { type: "png", ...clip } : { type: "jpeg", quality: 60, ...clip }));
  console.log("saved", file);
}
await browser.close();
