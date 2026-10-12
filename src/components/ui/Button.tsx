import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "link";
type Size = "md" | "lg";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 shrink-0", className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

const base =
  "group inline-flex items-center justify-center gap-3 whitespace-nowrap font-semibold transition-[background-color,border-color,color,filter] duration-200 disabled:opacity-60";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[14px]",
  lg: "h-14 px-7 text-[16px]",
};

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:brightness-110",
  secondary: "border border-fg/70 text-fg hover:bg-fg hover:text-bg",
  link: "h-auto gap-3 text-[16px] text-fg",
};

/**
 * Square, bold buttons. Primary is solid accent; secondary is an outline;
 * "link" is text with a small boxed accent arrow, as used for See what we do.
 */
export default function Button({ children, href, variant = "primary", size = "md", arrow = false, className, type = "button", ...rest }: Props) {
  const magnetic = variant !== "link" && size === "lg" ? { "data-magnetic": "" } : {};
  const cls = cn(base, "active:scale-[0.98]", variant !== "link" && sizes[size], variants[variant], className);
  const showBox = variant === "link";
  const inner = (
    <>
      <span>{children}</span>
      {showBox ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center bg-accent text-white transition-transform duration-200 group-hover:translate-x-1">
          <ArrowIcon className="h-3.5 w-3.5" />
        </span>
      ) : (
        arrow && <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a href={href} className={cls} {...magnetic} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...magnetic} onClick={rest.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement> | undefined}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...magnetic} {...rest}>
      {inner}
    </button>
  );
}
