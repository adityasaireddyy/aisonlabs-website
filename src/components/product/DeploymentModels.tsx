import { eduModels } from "@/data/products";
import Reveal from "@/components/ui/Reveal";
import { IconBox } from "@/components/ui/Icon";

/** The two ways an institution can run Aison Edu. Deployment models, not pricing plans. */
export default function DeploymentModels() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {eduModels.map((m, i) => (
        <Reveal key={m.id} delay={i * 80} className="card flex flex-col p-6 md:p-8">
          <div className="flex items-center gap-3">
            <IconBox name={m.id === "platform" ? "Layers3" : "SlidersHorizontal"} tone="accent" />
            <p className="label">{m.kind}</p>
          </div>
          <h3 className="h3 mt-2 text-[1.5rem]">{m.label}</h3>
          <p className="mt-3 text-[1.0625rem] font-medium tracking-[-0.01em]">{m.concept}</p>
          <p className="body mt-3 text-mute">{m.body}</p>

          <ol className="mt-6 flex flex-wrap items-center gap-2">
            {m.flow.map((step, j) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-none border border-line px-3 py-1 text-[13px] font-medium">{step}</span>
                {j < m.flow.length - 1 && (
                  <span aria-hidden="true" className="text-mute">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>

          {m.adapts && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="label mb-3">Adapted around your institution</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {m.adapts.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-[14px]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      ))}
    </div>
  );
}
