import Link from "next/link";
import type { Job } from "@/lib/db/content";
import { ArrowIcon } from "@/components/ui/Button";

/** Open role row. */
export default function JobCard({ job }: { job: Job }) {
  const meta = [job.team, job.location, job.type].filter(Boolean);
  return (
    <Link href={`/careers/${job.slug}`} className="card card-hover group flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h3 className="h3">{job.title}</h3>
        {job.summary && <p className="small mt-1.5 max-w-[60ch] text-mute">{job.summary}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <ul className="flex flex-wrap gap-2">
          {meta.map((m) => (
            <li key={m} className="rounded-none border border-line px-3 py-1 text-[13px] text-mute">
              {m}
            </li>
          ))}
        </ul>
        <ArrowIcon className="text-mute transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg" />
      </div>
    </Link>
  );
}
