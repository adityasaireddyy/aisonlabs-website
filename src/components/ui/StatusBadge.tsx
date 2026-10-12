import { cn } from "@/lib/utils";

/** Live status pill. Only used for products that are actually live. */
export default function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-none border border-line bg-bg px-3 py-1 text-[13px] font-medium text-fg", className)}>
      <span className="relative inline-flex h-2 w-2">
        <span className="pulse-ring absolute inset-0 rounded-full bg-accent/60" />
        <span className="relative h-2 w-2 rounded-full bg-accent" />
      </span>
      {label}
    </span>
  );
}
