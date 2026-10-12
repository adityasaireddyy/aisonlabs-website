// Interaction checks: desktop navigation, mobile menu, reduced motion.
// Usage: node scripts/visual-interact.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "./.visual/interact";
mkdirSync(out, { recursive: true });

let browser;
try { browser = await chromium.launch({ channel: "msedge" }); } catch { browser = await chromium.launch({ channel: "chrome" }); }
const results = {};
const shot = async (page, name) => writeFileSync(join(out, `${name}.jpg`), await page.screenshot({ type: "jpeg", quality: 60 }));

// Desktop navigation
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.click("nav[aria-label='Primary'] a[href='/work']");
  await page.waitForURL((u) => u.pathname === "/work", { timeout: 15000 });
  results.navToServices = await page.title();
  await page.goto(base + "/products", { waitUntil: "networkidle" });
  results.productsRedirect = new URL(page.url()).pathname;
  const gone = await page.request.get(base + "/products/aison-ai");
  results.removedProductStatus = gone.status();
  await shot(page, "desktop_product");
  results.desktopErrors = errors;
  await ctx.close();
}

// Mobile menu
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.click("button[aria-controls='mobile-menu']");
  await page.waitForTimeout(400);
  await shot(page, "mobile_menu_open");
  results.mobileMenuVisible = await page.isVisible("#mobile-menu");
  await page.click("#mobile-menu a[href='/research']");
  await page.waitForURL((u) => u.pathname === "/research", { timeout: 15000 });
  results.mobileNavUrl = new URL(page.url()).pathname;
  results.mobileMenuClosed = !(await page.isVisible("#mobile-menu"));
  results.mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  results.mobileErrors = errors;
  await ctx.close();
}

// Reduced motion: nothing may stay hidden
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  results.reducedHidden = await page.evaluate(() => [...document.querySelectorAll(".reveal")].filter((el) => getComputedStyle(el).opacity === "0").length);
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
