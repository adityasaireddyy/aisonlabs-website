// Visual verification: capture frames of each route at desktop and mobile.
// Usage: node shots.mjs [baseUrl] [outDir] [routes...]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "./.visual/capture";
const routes = process.argv.slice(4).length ? process.argv.slice(4) : ["/", "/work", "/products", "/products/aison-edu", "/research", "/research/software-should-adapt-to-the-organization", "/about", "/contact"];
mkdirSync(out, { recursive: true });

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

let browser; try { browser = await chromium.launch({ channel: "msedge" }); } catch { browser = await chromium.launch({ channel: "chrome" }); }
const report = [];

for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: 1 });
  for (const route of routes) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 300)}`); });
    await page.goto(base + route, { waitUntil: "networkidle" });
    // wait for preloader to finish
    await page.waitForFunction(() => !document.querySelector("[data-readouts]"), null, { timeout: 15000 }).catch(() => errors.push("preloader did not finish"));
    await page.waitForTimeout(2500);

    const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = vpName === "desktop" ? 900 : 1100;
    const maxShots = vpName === "desktop" ? (route === "/" ? 26 : 12) : (route === "/" ? 18 : 8);
    let i = 0;
    for (let y = 0; y < docH && i < maxShots; y += step, i++) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(700);
      const buf = await page.screenshot({ type: "jpeg", quality: 60 });
      writeFileSync(join(out, `${vpName}_${slug}_${String(i).padStart(2, "0")}_y${y}.jpg`), buf);
    }
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    report.push({ vp: vpName, route, docH, shots: i, horizontalOverflow, errors: [...new Set(errors)] });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
