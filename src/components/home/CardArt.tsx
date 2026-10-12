import { cn } from "@/lib/utils";

/**
 * Small abstract artwork for editorial cards: a grid of squares with a few
 * filled in the accent colour. Deterministic from the seed, so server and
 * client always agree.
 */
export default function CardArt({ seed = 1, className }: { seed?: number; className?: string }) {
  const cols = 10;
  const rows = 5;
  // Pure hash per cell, so rendering has no mutable state.
  const hash = (x: number, y: number) => {
    const v = Math.sin((x + 1) * 127.1 + (y + 1) * 311.7 + seed * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const cells: { x: number; y: number; k: 0 | 1 | 2 }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r = hash(x, y);
      const wave = Math.sin((x + seed) * 0.7) * 1.2 + rows / 2;
      const near = Math.abs(y - wave) < 1.4;
      cells.push({ x, y, k: near && r > 0.35 ? (r > 0.82 ? 2 : 1) : r > 0.92 ? 1 : 0 });
    }
  }
  return (
    <svg viewBox={`0 0 ${cols * 20} ${rows * 20}`} className={cn("block w-full", className)} aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      {cells.map((c) =>
        c.k === 0 ? (
          <rect key={`${c.x}-${c.y}`} x={c.x * 20 + 3} y={c.y * 20 + 3} width="14" height="14" fill="none" stroke="currentColor" strokeOpacity="0.14" />
        ) : c.k === 1 ? (
          <rect key={`${c.x}-${c.y}`} x={c.x * 20 + 3} y={c.y * 20 + 3} width="14" height="14" fill="currentColor" fillOpacity="0.78" />
        ) : (
          <rect key={`${c.x}-${c.y}`} x={c.x * 20 + 3} y={c.y * 20 + 3} width="14" height="14" fill="var(--accent)" />
        ),
      )}
    </svg>
  );
}
