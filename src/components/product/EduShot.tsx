import Image from "next/image";
import type { EduScreen } from "@/data/products";
import { cn } from "@/lib/utils";

type Props = {
  screen: EduScreen;
  className?: string;
  /** Load eagerly (use for the first screen on a page). */
  priority?: boolean;
  caption?: string;
  sizes?: string;
};

/** A real Aison Edu screen inside a simple window frame. */
export default function EduShot({ screen, className, priority, caption, sizes = "(min-width: 1280px) 1136px, 100vw" }: Props) {
  return (
    <figure className={cn("m-0", className)}>
      <div data-tilt="3" className="overflow-hidden rounded-none border border-line-strong bg-white shadow-[0_40px_90px_-40px_rgba(12,12,13,0.45)] ">
        <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-line bg-[#f3f3f1] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </div>
        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes={sizes} priority={priority} className="block h-auto w-full" />
      </div>
      {caption && <figcaption className="small mt-3 text-center text-mute">{caption}</figcaption>}
    </figure>
  );
}
