import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* Server-safe admin primitives. Interactive pieces live in ./client.tsx */

export function AdminHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        {eyebrow && <span className="t-mono mb-2 block text-mute">{eyebrow}</span>}
        <h1 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">{title}</h1>
        {description && <p className="t-small mt-2 max-w-[60ch] text-mute">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="t-mono text-mute">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-mute">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("admin-input", props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("admin-input min-h-[6rem] resize-y", props.className)} />;
}

export function Select({ options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select {...props} className={cn("admin-input", props.className)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

const TONES = {
  accent: "border-accent text-accent",
  ok: "border-emerald-500/60 text-emerald-400",
  mute: "border-line text-mute",
  fg: "border-line-strong text-fg",
  warn: "border-amber-500/60 text-amber-400",
} as const;

export function Badge({ children, tone = "mute" }: { children: ReactNode; tone?: keyof typeof TONES }) {
  return <span className={cn("t-mono inline-flex items-center border px-2 py-1 text-[10px]", TONES[tone])}>{children}</span>;
}

export function statusTone(status: string): keyof typeof TONES {
  if (["published", "open", "won", "hired"].includes(status)) return "ok";
  if (["new"].includes(status)) return "accent";
  if (["lost", "declined", "closed"].includes(status)) return "mute";
  if (["draft"].includes(status)) return "warn";
  return "fg";
}

export function LinkButton({ href, children, primary, className }: { href: string; children: ReactNode; primary?: boolean; className?: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "t-mono inline-flex h-10 items-center gap-2 border px-4 transition-colors duration-300",
        primary ? "border-fg bg-fg text-bg hover:bg-transparent hover:text-fg" : "border-line-strong text-fg hover:border-fg",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Stat({ label, value, href, hint }: { label: string; value: number | string; href?: string; hint?: string }) {
  const inner = (
    <div className="flex h-full flex-col justify-between border border-line p-5 transition-colors duration-300 hover:border-fg">
      <span className="t-mono text-mute">{label}</span>
      <div className="mt-6">
        <span className="tabular text-[2.25rem] font-semibold leading-none tracking-[-0.03em]">{value}</span>
        {hint && <span className="t-mono ml-3 text-mute">{hint}</span>}
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="t-small border border-dashed border-line px-4 py-10 text-center text-mute">{children}</p>;
}

export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-5 md:grid-cols-2", className)}>{children}</div>;
}

export function Panel({ children, title, className }: { children: ReactNode; title?: string; className?: string }) {
  return (
    <section className={cn("border border-line p-5 md:p-6", className)}>
      {title && <h2 className="t-mono mb-5 text-mute">{title}</h2>}
      {children}
    </section>
  );
}
