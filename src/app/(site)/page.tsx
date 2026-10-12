import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { aisonEdu, eduDashboard, eduMobile, eduModuleGroups } from "@/data/products";
import { services } from "@/data/services";
import { principles } from "@/data/philosophy";
import { formatDate } from "@/lib/markdown";
import { listArticles, listClientViews } from "@/lib/db/content";
import Section, { SectionHeader } from "@/components/ui/Section";
import Button, { ArrowIcon } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import EduShot from "@/components/product/EduShot";
import VisionMission from "@/components/sections/VisionMission";
import CTA from "@/components/sections/CTA";
import Icon, { IconBox, type IconName } from "@/components/ui/Icon";
import { categoryIcon, serviceIcon } from "@/data/icons";
import Galaxy from "@/components/home/Galaxy";
import ModuleExplorer from "@/components/home/ModuleExplorer";
import PrincipleList from "@/components/home/PrincipleList";
import CardArt from "@/components/home/CardArt";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

/** Tall editorial card in the reference's style: small caps label, bold title, arrow at the foot. */
function Tile({ href, kicker, title, tone, icon, children, delay = 0 }: { href: string; kicker: string; title: string; tone: "accent" | "light" | "dark"; icon: IconName; children?: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={href}
        className={cn(
          "group relative flex h-full min-h-[26rem] flex-col overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1.5 md:min-h-[30rem]",
          tone === "accent" && "bg-accent text-white",
          tone === "light" && "bg-[#f2f2f2] text-black",
          tone === "dark" && "border border-line-strong bg-[#0d0d10] text-white",
        )}
      >
        <IconBox name={icon} tone="current" />
        <p className="kicker mt-6">{kicker}</p>
        <h3 className="mt-4 max-w-[16ch] text-[clamp(1.375rem,1.9vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]">{title}</h3>
        <div className="mt-auto pt-8">{children}</div>
        <span className={cn("absolute right-5 top-5 grid h-8 w-8 place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100", tone === "light" ? "bg-black text-white" : "bg-white text-black")}>
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    </Reveal>
  );
}

export default async function HomePage() {
  const [articles, clients] = await Promise.all([listArticles({ status: "published", limit: 4 }), listClientViews()]);
  const [a1, a2] = articles;
  const phone = eduMobile.screens.find((s) => s.id === "home") ?? eduMobile.screens[0];

  return (
    <>
      {/* Hero */}
      <section id="hero" data-theme="dark" className="hero-space relative -mt-[var(--nav-h)] flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
        <Galaxy className="absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" />

        <div className="container-x relative z-10 flex flex-1 flex-col justify-between gap-12 pb-12 pt-[calc(var(--nav-h)+clamp(2.5rem,7vh,5rem))]">
          <Reveal>
            <Link href="/products/aison-edu" className="group mb-8 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.08em]">
              <span className="bg-accent px-2.5 py-1 text-white">Live</span>
              <span className="border-b border-transparent transition-colors group-hover:border-fg">Aison Edu V2 is in full rollout</span>
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <h1 className="h-display">
              <span className="block">We build</span>
              <span className="block lg:pl-[8%]">technology for</span>
              <span className="block lg:pl-[15%]">
                what comes ne<span className="text-accent">x</span>t.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={150} className="grid items-end gap-8 lg:grid-cols-[1fr_26rem]">
            <p className="label hidden lg:block">
              <span className="text-fg/80">Drag</span> to spin the galaxy · <span className="text-fg/80">click</span> to send a pulse
            </p>
            <div>
              <span aria-hidden="true" className="mb-5 block h-[3px] w-14 bg-accent" />
              <p className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em]">Technology for organizations, built around them.</p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-fg/80">
                Aison Labs is a technology company from India. We build our own products and engineer custom software around how organizations actually work.
              </p>
              <div className="mt-6">
                <Button href="/work" variant="link">
                  See what we do
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Editorial cards */}
      <section data-theme="dark" className="border-t border-line pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2.5rem,5vw,4rem)]">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Tile href="/products/aison-edu" kicker="Announcement" title="Aison Edu V2 is in full rollout" tone="accent" icon="GraduationCap">
            <StatusBadge label={aisonEdu.statusLabel} className="border-white/40 bg-transparent text-white" />
          </Tile>
          {a1 ? (
            <Tile href={`/research/${a1.slug}`} kicker={`Perspective · ${a1.category}`} title={a1.title} tone="light" icon={categoryIcon(a1.category)} delay={60}>
              <CardArt seed={3} className="text-black" />
            </Tile>
          ) : (
            <Tile href="/work" kicker="Services" title="Technology built around the problem" tone="light" icon="Code" delay={60}>
              <CardArt seed={3} className="text-black" />
            </Tile>
          )}
          {a2 ? (
            <Tile href={`/research/${a2.slug}`} kicker={`Perspective · ${a2.category}`} title={a2.title} tone="light" icon={categoryIcon(a2.category)} delay={120}>
              <CardArt seed={8} className="text-black" />
            </Tile>
          ) : (
            <Tile href="/about" kicker="Company" title="A small team with a large horizon" tone="light" icon="Telescope" delay={120}>
              <CardArt seed={8} className="text-black" />
            </Tile>
          )}
          <Tile href="/products/aison-edu#mobile" kicker="Mobile app" title="A mobile app for parents, teachers, hostel wardens and attenders" tone="dark" icon="Smartphone" delay={180}>
            <div className="-mx-6 -mb-6 overflow-hidden">
              <Image src={phone.src} alt="" width={phone.width} height={phone.height} sizes="(min-width: 1024px) 24vw, 80vw" className="mx-auto h-[19rem] w-auto max-w-none translate-y-8 object-cover object-top transition-transform duration-500 group-hover:translate-y-3" />
            </div>
          </Tile>
        </div>

        <div className="container-x mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/work", kicker: "Services", title: "Custom engineering around your organization", seed: 12, icon: "Settings2" as IconName },
            { href: "/products/aison-edu#transport", kicker: "Transport", title: "Bus routes on the map, and live buses on the road", seed: 17, icon: "Bus" as IconName },
            { href: "/careers", kicker: "Careers", title: "Build what comes next, with us", seed: 21, icon: "Users" as IconName },
            { href: "/about", kicker: "Company", title: "We're early, and building for much further ahead", seed: 26, icon: "Rocket" as IconName },
          ].map((t, i) => (
            <Tile key={t.href} href={t.href} kicker={t.kicker} title={t.title} tone="light" icon={t.icon} delay={i * 60}>
              <CardArt seed={t.seed} className="h-16 text-black" />
            </Tile>
          ))}
        </div>
      </section>

      {/* Product feature */}
      <section data-theme="dark" className="border-t border-line py-[clamp(4rem,9vw,8rem)]" id="product">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <Reveal>
            <EduShot screen={eduDashboard} priority caption="The Aison Edu V2 dashboard, shown with sample data." />
          </Reveal>
          <Reveal delay={100}>
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <p className="kicker">Our product</p>
              <StatusBadge label={aisonEdu.statusLabel} />
            </div>
            <h2 className="h2">{aisonEdu.tagline}</h2>
            <p className="lead mt-5">{aisonEdu.description}</p>
            <p className="mt-6 text-[1.0625rem] leading-snug">
              <span className="text-mute">Deployed with </span>
              <span className="font-semibold">{aisonEdu.deployments.map((d) => d.name).join(", ")}</span>
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([["Layers3", "Web platform"], ["Smartphone", "Mobile app"], ["Bus", "Live bus map"], ["Bot", "AI assistant"]] as [IconName, string][]).map(([ic, label]) => (
                <li key={label} className="flex flex-col items-start gap-3 border border-line p-4 transition-colors duration-200 hover:border-fg">
                  <Icon name={ic} size={26} strokeWidth={1.5} className="text-accent" />
                  <span className="text-[14px] font-semibold leading-tight">{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/products/aison-edu" variant="link">
                Explore Aison Edu
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modules */}
      <Section padding="lg">
        <SectionHeader eyebrow="Inside Aison Edu" title="One system for the whole institution." lead="Academics, people, finance, campus operations and communication, working from the same records. Pick a group to see its modules." />
        <Reveal>
          <ModuleExplorer groups={eduModuleGroups} />
        </Reveal>
      </Section>

      {/* Statement + colour tiles */}
      <section data-theme="dark" className="overflow-hidden border-t border-line py-[clamp(4rem,9vw,8rem)]">
        <div className="container-x">
          <Reveal>
            <h2 className="mx-auto max-w-[20ch] text-center text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.035em]">Software should adapt to the organization.</h2>
            <p className="lead mx-auto mt-6 max-w-[40rem] text-center">No organization should have to reshape itself around rigid software. Aison Edu comes three ways, and in an institutional build everything is customizable.</p>
          </Reveal>
          <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-6 md:grid-cols-3">
            {[
              { icon: "Layers3" as IconName, href: "/products/aison-edu#models", bg: "bg-[#0a3cf0] text-white", label: "Platform", line: "Ready to use. Ready to scale.", off: "" },
              { icon: "SlidersHorizontal" as IconName, href: "/products/aison-edu#models", bg: "bg-accent text-white", label: "Institutional", line: "Your institution. Your workflows. Your Aison Edu.", off: "md:translate-y-14" },
              { icon: "Smartphone" as IconName, href: "/products/aison-edu#mobile", bg: "bg-[#f2f2f2] text-black", label: "Mobile app", line: "For parents, teachers, hostel wardens and attenders.", off: "md:translate-y-28" },
            ].map((t, i) => (
              <Reveal key={t.label} delay={i * 90} className={t.off}>
                <Link href={t.href} className={cn("group relative flex aspect-[4/3] flex-col justify-between overflow-hidden p-7 transition-transform duration-300 hover:-translate-y-2", t.bg)}>
                  <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-30" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="120" cy="150" r="52" />
                    <path d="M-10 90 C 90 70, 150 120, 230 110 S 360 40, 420 70" />
                    <path d="M230 110 L 236 320" />
                    <path d="M400 190 C 330 200, 300 250, 270 330" />
                  </svg>
                  <span className="relative flex items-center gap-3">
                    <IconBox name={t.icon} tone="current" />
                    <span className="kicker">{t.label}</span>
                  </span>
                  <span className="relative max-w-[16ch] font-serif text-[clamp(1.5rem,2.2vw,2rem)] italic leading-tight">{t.line}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="h-0 md:h-28" aria-hidden="true" />
        </div>
      </section>

      {/* Services index */}
      <Section tone="soft" padding="lg">
        <SectionHeader
          eyebrow="Services"
          title="Technology built around the problem."
          lead="Not around a predefined template. We take on work where understanding the organization matters as much as writing the code."
          action={
            <Button href="/work" variant="link">
              All services
            </Button>
          }
        />
        <ul className="border-t border-line-strong">
          {services.slice(0, 6).map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 40}>
              <Link href={`/work/${s.slug}`} className="group grid items-center gap-x-8 gap-y-2 border-b border-line-strong px-0 py-6 transition-colors duration-200 hover:bg-black hover:px-5 hover:text-white md:grid-cols-[3.5rem_1.1fr_1.4fr_2rem]">
                <IconBox name={serviceIcon(s.index)} size="sm" tone="current" />
                <span className="text-[clamp(1.375rem,2.4vw,2rem)] font-medium tracking-[-0.025em]">{s.title}</span>
                <span className="small text-mute transition-colors group-hover:text-white/70">{s.body}</span>
                <ArrowIcon className="hidden justify-self-end transition-transform duration-200 group-hover:translate-x-1 md:block" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Vision and mission */}
      <Section padding="lg" border>
        <SectionHeader eyebrow="Direction" title="Where we are going, and how." />
        <VisionMission />
      </Section>

      {/* Principles */}
      <Section tone="dark" padding="lg">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-3">How we work</p>
            <h2 className="h2">Five principles behind everything we build.</h2>
            <p className="lead mt-5">Hover or tap one to open it.</p>
          </Reveal>
          <Reveal delay={100}>
            <PrincipleList principles={principles} />
          </Reveal>
        </div>
      </Section>

      {/* Research */}
      {articles.length > 0 && (
        <Section tone="dark" padding="lg" border>
          <SectionHeader
            eyebrow="Research"
            title="Aison Labs research"
            action={
              <Button href="/research" variant="link">
                All research
              </Button>
            }
          />
          <ul className="border-t border-line-strong">
            {articles.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={i * 40}>
                <Link href={`/research/${a.slug}`} className="group grid items-baseline gap-x-8 gap-y-1 border-b border-line-strong py-6 transition-colors hover:text-accent md:grid-cols-[2.5rem_10rem_1fr_2rem]">
                  <Icon name={categoryIcon(a.category)} size={22} className="hidden text-accent md:block" />
                  <span className="label">{formatDate(a.publishedAt)}</span>
                  <span className="text-[clamp(1.25rem,2.2vw,1.875rem)] font-medium leading-snug tracking-[-0.025em]">{a.title}</span>
                  <ArrowIcon className="hidden justify-self-end transition-transform duration-200 group-hover:translate-x-1 md:block" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Clients + company */}
      <Section tone="soft" padding="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-3">Company</p>
            <h2 className="h2">We&apos;re early. We&apos;re building for much further ahead.</h2>
            <p className="lead mt-5">
              We are still a startup: small enough to experiment quickly, rethink assumptions and build from first principles. Our ambition is simple. Build technology that can matter at scale, and help change the technology landscape of India.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/about" variant="link">
                About Aison Labs
              </Button>
              <Button href="/careers" variant="link">
                Careers
              </Button>
            </div>
          </Reveal>
          {clients.length > 0 && (
            <Reveal delay={100}>
              <p className="label mb-4">Organizations we build with</p>
              <ul className="grid grid-cols-2 gap-px bg-line-strong">
                {clients.map((c) => (
                  <li key={c.slug} className="bg-[#f2f2f2]">
                    <Link href="/work#clients" className="flex items-center gap-3 px-5 py-5 text-[1.0625rem] font-semibold tracking-[-0.015em] transition-colors duration-200 hover:bg-black hover:text-white">
                      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center bg-black text-[13px] font-bold text-white">{c.name.split(/[s-]+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</span>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </Section>

      <CTA secondary={{ label: "See Aison Edu", href: "/products/aison-edu" }} />
    </>
  );
}
