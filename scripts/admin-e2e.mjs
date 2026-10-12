// End-to-end check of the CMS + CRM: login, create content, submit public forms, verify in admin.
// Usage: node scripts/admin-e2e.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "./.visual/admin";
mkdirSync(out, { recursive: true });
const stamp = Date.now().toString(36);

let browser;
try { browser = await chromium.launch({ channel: "msedge" }); } catch { browser = await chromium.launch({ channel: "chrome" }); }
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 200)}`); });
const shot = async (name) => writeFileSync(join(out, `${name}.jpg`), await page.screenshot({ type: "jpeg", quality: 60 }));
const results = {};
const bodyHas = async (text, expect = true, timeout = 12000) =>
  page.waitForFunction(([t, e]) => ((document.querySelector("main") ?? document.body).innerText.toLowerCase().includes(t.toLowerCase())) === e, [text, expect], { timeout }).then(() => true).catch(() => false);

// 1. Unauthenticated access redirects to login
await page.goto(base + "/admin/leads", { waitUntil: "networkidle" });
results.redirectToLogin = page.url().includes("/admin/login");
await shot("01_login");

// 2. Login
await page.fill("input[name='email']", "admin@aisonlabs.local");
await page.fill("input[name='password']", "aisonlabs");
await page.click("button[type='submit']");
await page.waitForURL(/\/admin(\/leads)?$/, { timeout: 15000 });
results.loggedInUrl = page.url();
await page.goto(base + "/admin", { waitUntil: "networkidle" });
await shot("02_dashboard");

// 3. Create a published blog post
await page.goto(base + "/admin/blog/new", { waitUntil: "networkidle" });
const postTitle = `E2E post ${stamp}`;
await page.fill("input[name='title']", postTitle);
await page.fill("input[name='category']", "Building");
await page.selectOption("select[name='status']", "published");
await page.fill("textarea[name='excerpt']", "Created by the end-to-end check.");
await page.fill("textarea[name='content']", "## It works\n\nThis post was created through the CMS.\n\n> A quote\n\n1. One\n2. Two");
await shot("03_post_editor");
await page.click("form[data-action-form] button[type='submit']");
await page.waitForURL(/\/admin\/blog$/, { timeout: 15000 });
results.postListed = (await page.textContent("body")).includes(postTitle);
await shot("04_blog_list");
const postSlug = `e2e-post-${stamp}`;
await page.goto(base + `/blog/${postSlug}`, { waitUntil: "networkidle" });
await page.waitForFunction(() => !document.querySelector("[data-readouts]"), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1500);
results.publicPostOk = (await page.textContent("body")).includes("This post was created through the CMS");
await shot("05_public_post");

// 4. Create an open role
await page.goto(base + "/admin/careers/new", { waitUntil: "networkidle" });
const jobTitle = `Product Engineer ${stamp}`;
await page.fill("input[name='title']", jobTitle);
await page.fill("input[name='team']", "Engineering");
await page.fill("input[name='location']", "Remote (India)");
await page.selectOption("select[name='status']", "open");
await page.fill("textarea[name='summary']", "Build systems around real organizations.");
await page.click("form[data-action-form] button[type='submit']");
await page.waitForURL(/\/admin\/careers$/, { timeout: 15000 });
results.jobListed = (await page.textContent("body")).includes(jobTitle);

// 5. Public careers page shows the role; submit an application
await page.goto(base + "/careers", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
results.publicCareersHasJob = (await page.textContent("body")).includes(jobTitle);
await shot("06_public_careers");
await page.goto(base + `/careers/product-engineer-${stamp}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.fill("input[name='name']", "Applicant Test");
await page.fill("input[name='email']", "applicant@example.com");
await page.fill("input[name='links']", "github.com/example");
await page.fill("textarea[name='message']", "I would like to build things.");
await page.click("form button[type='submit']");
await page.waitForTimeout(1500);
results.applicationSent = (await page.textContent("body")).includes("We read every application");
await shot("07_public_job_applied");

// 6. Submit the contact form (creates a lead)
await page.goto(base + "/contact", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.fill("input[name='name']", `Lead Test ${stamp}`);
await page.fill("input[name='organization']", "Test Org");
await page.fill("input[name='email']", "lead@example.com");
await page.click("button[role='radio'] >> nth=0");
await page.fill("textarea[name='message']", "We need a custom system.");
await page.click("button[type='submit']");
await page.waitForTimeout(1500);
results.contactSent = (await page.textContent("body")).includes("Received");

// 7. CRM: lead appears, status can change, note can be added
await page.goto(base + "/admin/leads", { waitUntil: "networkidle" });
results.leadListed = (await page.textContent("body")).includes(`Lead Test ${stamp}`);
await shot("08_leads");
await page.click(`a:has-text("Lead Test ${stamp}")`);
await page.waitForURL(/\/admin\/leads\/[a-f0-9-]+$/, { timeout: 15000 });
await page.selectOption("select[name='status']", "qualified");
await page.click("form:has(select[name='status']) button[type='submit']");
results.leadQualified = await bodyHas("Status changed from new to qualified");
await page.fill("textarea[name='body']", "Called them. Good fit.");
await page.click("form:has(textarea[name='body']) button[type='submit']");
results.leadNoteAdded = await bodyHas("Called them. Good fit.");
await shot("09_lead_detail");
const leadUrl = page.url();

// 8. Applications visible
await page.goto(base + "/admin/applications", { waitUntil: "networkidle" });
results.applicationListed = (await page.textContent("body")).includes("Applicant Test");
await shot("10_applications");

// 9. CSV export
const csv = await page.request.get(base + "/admin/leads/export");
results.csvOk = csv.ok() && (await csv.text()).includes("lead@example.com");

// 10. Settings save
await page.goto(base + "/admin/settings", { waitUntil: "networkidle" });
await page.fill("input[name='careersEmail']", "careers@example.com");
await page.click("form:has(input[name='siteUrl']) button[type='submit']");
results.settingsSaved = await bodyHas("Settings saved");
await shot("11_settings");

// 11. Cleanup: delete the e2e post and job
page.on("dialog", (d) => d.accept());
await page.goto(base + "/admin/blog", { waitUntil: "networkidle" });
await page.click(`a:has-text("${postTitle}")`);
await page.waitForURL(/\/admin\/blog\/[a-f0-9-]+$/);
await page.click("button:has-text('Delete')");
await page.waitForURL(/\/admin\/blog$/, { timeout: 15000 });
results.postDeleted = await bodyHas(postTitle, false);
await page.goto(base + "/admin/careers", { waitUntil: "networkidle" });
await page.click(`a:has-text("${jobTitle}")`);
await page.waitForURL(/\/admin\/careers\/[a-f0-9-]+$/);
await page.click("button:has-text('Delete')");
await page.waitForURL(/\/admin\/careers$/, { timeout: 15000 });
results.jobDeleted = await bodyHas(jobTitle, false);

// Cleanup CRM test records
await page.goto(leadUrl, { waitUntil: "networkidle" });
await page.click("button:has-text('Delete lead')");
await page.waitForURL((u) => u.pathname === "/admin/leads", { timeout: 15000 });
results.leadDeleted = await bodyHas("Lead Test " + stamp, false);
await page.goto(base + "/admin/applications", { waitUntil: "networkidle" });
while (await page.$("a:has-text('Applicant Test')")) {
  await page.click("a:has-text('Applicant Test')");
  await page.waitForURL((u) => /^\/admin\/applications\/[a-f0-9-]+$/.test(u.pathname));
  await page.click("button:has-text('Delete application')");
  await page.waitForURL((u) => u.pathname === "/admin/applications", { timeout: 15000 });
  await page.waitForTimeout(500);
}
results.applicationsCleaned = true;

// 12. Logout
await page.click("button:has-text('Sign out')", { force: true });
await page.waitForURL((u) => u.pathname.startsWith("/admin/login"), { timeout: 15000 });
results.loggedOut = true;

results.errors = [...new Set(errors)];
await browser.close();
console.log(JSON.stringify(results, null, 2));
