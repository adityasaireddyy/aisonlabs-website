import { cn } from "@/lib/utils";

type Props = {
  /** Pixel size of the mark. */
  size?: number;
  className?: string;
  /** Show the wordmark next to the mark. */
  wordmark?: boolean;
  /** Use the accent colour for the core. */
  accent?: boolean;
  title?: string;
};

/**
 * Aison Labs mark: an outer ring, a tilted orbital ring and a solid core.
 * Drawn in currentColor so it works over ink, paper and blend modes.
 */
export function LogoMark({ size = 28, className, accent, title = "Aison Labs" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="4" />
      <ellipse cx="50" cy="50" rx="46" ry="17.5" fill="none" stroke="currentColor" strokeOpacity="0.9" strokeWidth="4.5" transform="rotate(-22 50 50)" />
      <circle cx="50" cy="50" r="15" fill={accent ? "var(--accent)" : "currentColor"} />
    </svg>
  );
}

export default function Logo({ size = 26, className, wordmark = true, accent, title }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} accent={accent} title={title} />
      {wordmark && <span className="text-[15px] font-semibold tracking-[-0.02em]">AISON LABS</span>}
    </span>
  );
}
