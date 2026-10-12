import Reveal from "@/components/ui/Reveal";

type Props = {
  title?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

/** Closing band: full-bleed accent colour, big statement, one decisive action. */
export default function CTA({
  title = "Have a problem worth solving?",
  body = "Tell us what you are trying to build, fix or rethink. We reply to every message.",
  primary = { label: "Start a conversation", href: "/contact" },
  secondary,
}: Props) {
  return (
    <section className="bg-accent text-white">
      <div className="container-x py-[clamp(3.5rem,8vw,6.5rem)]">
        <Reveal className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <h2 className="h1 max-w-[18ch] text-white">{title}</h2>
          <div>
            <p className="text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-snug text-white/90">{body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={primary.href} className="group inline-flex h-14 items-center gap-3 bg-black px-7 text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-black">
                {primary.label}
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </a>
              {secondary && (
                <a href={secondary.href} className="inline-flex h-14 items-center border border-white px-7 text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-black">
                  {secondary.label}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
