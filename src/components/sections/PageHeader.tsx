import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";
import CardArt from "@/components/home/CardArt";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Small element beside the eyebrow, e.g. a status badge. */
  badge?: ReactNode;
  children?: ReactNode;
};

/** Page opener: black, big heading on the left, a short accented text column on the right. */
export default function PageHeader({ eyebrow, title, lead, badge, children }: Props) {
  return (
    <section data-theme="dark" className="border-b border-line">
      <div className="container-x py-[clamp(3.5rem,8vw,7rem)]">
        <Reveal className="grid items-end gap-x-16 gap-y-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <p className="kicker text-fg">{eyebrow}</p>
              {badge}
            </div>
            <h1 className="h1 max-w-[16ch]">{title}</h1>
          </div>
          {(lead || children) && (
            <div className="lg:pb-2">
              <span aria-hidden="true" className="mb-5 block h-[3px] w-14 bg-accent" />
              {lead && <p className="lead">{lead}</p>}
              {children && <div className="mt-7">{children}</div>}
            </div>
          )}
        </Reveal>
        <CardArt seed={eyebrow.length * 3 + (eyebrow.charCodeAt(0) % 11)} className="mt-[clamp(2.5rem,5vw,4rem)] hidden h-14 text-fg opacity-45 md:block" />
      </div>
    </section>
  );
}
