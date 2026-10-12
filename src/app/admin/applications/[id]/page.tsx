import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { APPLICATION_STATUSES, getApplication } from "@/lib/db/crm";
import { formatDateTime } from "@/lib/markdown";
import { AdminHeader, Badge, LinkButton, Panel, statusTone } from "@/components/admin/ui";
import { ConfirmButton, StatusForm } from "@/components/admin/client";
import { deleteApplicationAction, updateApplicationAction } from "../../actions";

function linkify(text: string) {
  return text.split(/[\s,]+/).filter(Boolean).map((part, i) => {
    const href = /^https?:\/\//.test(part) ? part : /^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(part) ? `https://${part}` : null;
    return href ? (
      <a key={i} href={href} target="_blank" rel="noreferrer" className="block break-all underline underline-offset-2">
        {part}
      </a>
    ) : (
      <span key={i} className="block">
        {part}
      </span>
    );
  });
}

export default async function ApplicationDetail(props: PageProps<"/admin/applications/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const app = await getApplication(id);
  if (!app) notFound();

  return (
    <>
      <AdminHeader
        eyebrow="CRM / Application"
        title={app.name}
        description={`${app.jobTitle} · received ${formatDateTime(app.createdAt)}`}
        actions={
          <>
            <Badge tone={statusTone(app.status)}>{app.status}</Badge>
            <LinkButton href="/admin/applications">Back</LinkButton>
            <LinkButton href={`mailto:${app.email}?subject=${encodeURIComponent(`Your application to Aison Labs: ${app.jobTitle}`)}`} primary>
              Reply by email
            </LinkButton>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Panel title="Application">
          <dl className="grid gap-4 text-[14px] sm:grid-cols-2">
            <div>
              <dt className="t-mono text-mute">Email</dt>
              <dd>{app.email}</dd>
            </div>
            <div>
              <dt className="t-mono text-mute">Phone</dt>
              <dd>{app.phone || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="t-mono text-mute">Links</dt>
              <dd className="mt-1">{app.links ? linkify(app.links) : "—"}</dd>
            </div>
          </dl>
          <div className="mt-6 border-t border-line pt-6">
            <p className="t-mono mb-2 text-mute">Message</p>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{app.message}</p>
          </div>
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title="Stage">
            <StatusForm action={updateApplicationAction} id={app.id} current={app.status} options={APPLICATION_STATUSES} />
          </Panel>
          <Panel title="Danger zone">
            <form action={deleteApplicationAction}>
              <input type="hidden" name="id" value={app.id} />
              <ConfirmButton message="Delete this application?">Delete application</ConfirmButton>
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
