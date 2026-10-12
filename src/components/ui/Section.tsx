import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Tone = "default" | "soft" | "dark";

type SectionProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  /** Vertical rhythm. */
  padding?: "sm" | "md" | "lg";
  border?: boolean;
};

const pads = {
  sm: "py-[clamp(2.5rem,5vw,4rem)]",
  md: "py-[clamp(3.5rem,7vw,6rem)]",
  lg: "py-[clamp(4.5rem,9vw,7.5rem)]",
};

/** Page section: sets tone and vertical rhythm and centres content in the container. */
export default function Section({ children, tone = "default", className, id, padding = "md", border }: SectionProps) {
  return (
    <section
      id={id}
      data-theme={tone === "dark" ? "dark" : undefined}
      className={cn(pads[padding], tone === "soft" && "tone-soft", border && "border-t border-line", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

type HeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
};

/** Consistent section opener: eyebrow, heading, supporting line, optional action. */
export function SectionHeader({ eyebrow, title, lead, align = "left", action, className, as: Tag = "h2" }: HeaderProps) {
  return (
    <Reveal
      className={cn(
        "mb-[clamp(2rem,4vw,3.5rem)] flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-[44rem]", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag className="h2">{title}</Tag>
        {lead && <p className="lead mt-4">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
