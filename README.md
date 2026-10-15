# Aison Labs — Website, CMS and CRM

The official website for Aison Labs, with a built-in admin for managing content (CMS) and enquiries (CRM).

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, SQLite via libsql. No animation libraries.

> We build technology for what comes next.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin is at http://localhost:3000/admin.

**First sign-in:** `admin@aisonlabs.local` / `aisonlabs` (or whatever `ADMIN_EMAIL` / `ADMIN_PASSWORD` were set to when the database was first created). Change the password in Settings before going live; the admin shows a warning until you do.

Production build: `npm run build && npm start`.

Copy `.env.example` to `.env.local` and fill in what you have. Nothing is required to run locally: a SQLite file is created at `db/aison.db` and seeded on first request.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `file:./db/aison.db` locally. For production point it at a hosted libsql/Turso database (`libsql://…`) with `DATABASE_AUTH_TOKEN`. |
| `AUTH_SECRET` | Signs admin sessions. Required in production, 16+ random characters. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used once, when the database is first created. |
| `CONTACT_WEBHOOK_URL` | Optional. Every lead and application is also POSTed as JSON here (email service, Slack, automation tool). Submissions are stored in the CRM regardless. |
| `NEXT_PUBLIC_SITE_URL` | Fallback canonical URL; the value in Settings takes precedence. |

## Admin: CMS

Everything the site publishes is editable at `/admin`:

- **Blog** (`/admin/blog`) → `/blog`. Markdown posts with category, tags, cover image URL, excerpt, publish date and draft/published status. The newest post is featured on the blog index.
- **Research** (`/admin/research`) → `/research` and the research section on the home page. Perspective pieces. The five launch essays are seeded on first run.
- **Careers** (`/admin/careers`) → `/careers`. Roles with team, location, type and a markdown description. Open roles get their own page and application form; with no open roles the careers page shows an open-application form.
- **Clients** (`/admin/clients`) → home page, `/work`, `/products/aison-edu`. Service clients and product deployments stay distinct (Mandaara Educational Trust is an Aison Edu deployment, never a services client). Case-study fields remain empty until a real one exists.
- **Settings** (`/admin/settings`). Site URL, contact and careers emails, social links, your password.

The editor is Markdown with a live preview. Public pages render from the database on every request, so a change is live the moment it is saved.

## Admin: CRM

- **Leads** (`/admin/leads`). Every contact-form submission becomes a lead. Pipeline: new → contacted → qualified → proposal → won / lost. Each lead has notes and an activity trail; status changes are logged automatically. Filter, search, add leads manually, export CSV.
- **Applications** (`/admin/applications`). Every careers submission, linked to its role. Stages: new → reviewing → interview → offer → hired / declined.

## Where things live

```
src/
  app/
    (site)/               marketing routes, wrapped by the site shell (header, footer)
      page.tsx            home
      work/               services
      products/           redirects to the one live product
      products/aison-edu  Aison Edu
      research/ blog/ careers/ about/ contact/
    admin/                CMS + CRM (own layout, guarded by src/proxy.ts)
      actions.ts          all admin mutations (server actions)
    api/contact           contact form → lead
    api/careers/apply     application form → application
    sitemap.ts robots.ts opengraph-image.tsx icon.svg
  lib/
    db/client.ts          libsql client, schema migrations, first-run seed
    db/content.ts         posts, articles, jobs, clients, settings
    db/crm.ts             leads, notes, applications
    auth.ts               scrypt passwords, signed session cookie, requireAdmin()
    markdown.ts           marked renderer, reading time, slugify
  components/
    ui/                   Button, Section + SectionHeader, Reveal, StatusBadge, Logo
    navigation/Navbar     sticky header with the mobile menu
    layout/Footer         column footer; socials appear only when configured in Settings
    sections/             PageHeader, CTA
    product/              EduWindow (application-window composite), EduPanels, DeploymentModels
    research/ blog/ careers/ forms/ admin/
  data/products.ts        live products only (Aison Edu), its surfaces and deployment models
  data/services.ts        service lines and process
  data/site.ts            navigation, footer groups, site metadata
  proxy.ts                redirects unauthenticated /admin requests to the login page
```

## Content rule

Only live products appear on the website. Today that is Aison Edu. Products that are planned, in development or internal are not listed anywhere: not in navigation, pages, the sitemap or structured data. Add a product to `src/data/products.ts` only when it is live with a real deployment.

Never invent numbers, achievements, testimonials, launch dates, users, revenue, benchmarks, customers, certifications, partnerships or capabilities. The Aison Edu interface shown on the site is a representative composite with illustrative data, and is labelled as such. Case studies stay "Case study soon" until a real one is approved.

## Design system

Defined in `src/app/globals.css`. White ground, ink text, one accent, 14px radius, content capped at 76rem.

- Type classes: `h-display`, `h1`, `h2`, `h3`, `lead`, `body`, `small`, `eyebrow`, `label`. They sit in the `components` layer, so Tailwind utilities override them.
- Surfaces: `card`, `card-hover`, `tone-soft`; dark sections via `<Section tone="dark">`.
- Motion: one component, `Reveal`, fades content up once as it enters the viewport (IntersectionObserver plus a CSS transition). No animation library, no scroll hijacking. Reduced-motion and no-JS show content immediately.

## Verification scripts

All use Playwright with the installed Edge or Chrome and print a JSON report.

```bash
npm run visual          # frames of every public route at 1440×900 and 390×844 → .visual/capture
npm run visual:interact # navigation, products redirect, mobile menu, reduced motion
npm run e2e:admin       # sign in, create a post and a role, submit both public forms, verify the CRM, clean up
```

## Deploying

Any Node host works. For serverless platforms use a hosted libsql database (`DATABASE_URL=libsql://…`), set `AUTH_SECRET`, and set `ADMIN_EMAIL` / `ADMIN_PASSWORD` before the first request so the seeded admin is yours.

## Aison Edu content

The site shows no product screenshots. Aison Edu is presented through its features: module list and descriptions (`src/data/products.ts`, `src/data/edu-features.ts`), role summaries, transport and mobile app copy. Describe only what the product does; do not add outcomes or customer numbers. The route graphic is a drawn illustration (`RouteDiagram`), not a product screen.

## Interaction layer

- **Galaxy hero** (`src/components/home/Galaxy.tsx`): canvas spiral galaxy. Pointer parallax and tilt, drag to spin with inertia, click for a shockwave, scroll pulls it closer. Pauses off-screen, thins out on small screens, and draws one still frame under reduced motion.
- **`Interactions`** (`src/components/ui/Interactions.tsx`): delegated effects for the whole site. `.card` gets a pointer spotlight, `[data-tilt]` tilts toward the pointer. Buttons stay still. Also renders the scroll-progress line and back-to-top button.
- **Explorers:** `ModuleExplorer` (module tabs, arrow keys), `PrincipleList` (accordion), module tiles with icons and descriptions.

## Visual language (enterprise style)

Modelled on the feel of large consulting-firm sites: black-dominant, flat and square, bold.

- **Tokens** (`globals.css`): `--radius: 0`, content up to 96rem wide, accent orange. Headline scale: `h-display` (uppercase, 700), `h1`/`h2` (500, tight), `kicker` (small uppercase label), `eyebrow` (label with an accent bar).
- **Buttons** (`ui/Button.tsx`): square. Primary is solid accent, secondary is an outline, `link` is text with a boxed accent arrow.
- **Home** (`app/(site)/page.tsx`): galaxy hero with a three-line uppercase headline and a right-hand text column, two rows of tall editorial `Tile` cards, a product feature block, staggered colour tiles, a service index, principles, research list and a full-bleed accent call to action.
- **Inner pages**: a black `PageHeader` (heading left, short accented text right) over white and light-grey sections.
- **Layer note:** the base `section` / `[data-theme]` background rule lives in `@layer base`, so utilities such as `bg-accent` can override it.
