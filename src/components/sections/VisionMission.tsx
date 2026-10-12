import Reveal from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";
import { mission, vision } from "@/data/site";

/** Two large statements side by side: where we are going, and how we get there. */
export default function VisionMission() {
  const items = [
    { ...vision, icon: "Telescope" as const, tone: "bg-accent text-white" },
    { ...mission, icon: "Target" as const, tone: "bg-[#0d0d10] text-white border border-line-strong" },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((it, i) => (
        <Reveal key={it.title} delay={i * 80}>
          <div className={`flex h-full min-h-[22rem] flex-col p-7 md:p-10 ${it.tone}`}>
            <IconBox name={it.icon} tone="current" size="lg" />
            <p className="kicker mt-8">Our {it.title.toLowerCase()}</p>
            <p className="mt-4 max-w-[26ch] text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.025em]">{it.statement}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
