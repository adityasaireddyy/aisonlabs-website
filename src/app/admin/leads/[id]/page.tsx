import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { LEAD_STATUSES, getLead, listLeadNotes } from "@/lib/db/crm";
import { formatDateTime } from "@/lib/markdown";
import { AdminHeader, Badge, Field, FormGrid, Input, LinkButton, Panel, Select, Textarea, statusTone } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/client";
import { addLeadNoteAction, deleteLeadAction, updateLeadAction } from "../../actions";

export default async function LeadDetail(props: PageProps<"/admin/leads/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const [lead, notes] = await Promise.all([getLead(id), listLeadNotes(id)]);
  if (!lead) notFound();

  return (
    <>
      <AdminHeader
        eyebrow="CRM / Lead"
        title={lead.name}
        description={`${lead.organization || "No organization"} · via ${lead.source} · received ${formatDateTime(lead.createdAt)}`}
        actions={
          <>
            <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
            <LinkButton href="/admin/leads">Back</LinkButton>
            <LinkButton href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your message to Aison Labs")}`} primary>
              Reply by email
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-6">
          <Panel title="Message">
            {lead.intent && <p className="t-mono mb-3 text-accent">{lead.intent}</p>}
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{lead.message || "—"}</p>
          </Panel>

          <Panel title="Activity and notes">
            <form action={addLeadNoteAction} className="mb-6 flex flex-col gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <Textarea name="body" rows={3} placeholder="Call summary, next step, context…" required />
              <div>
                <SubmitButton primary={false} pendingText="Adding">
                  Add note
                </SubmitButton>
              </div>
            </form>
            {notes.length === 0 ? (
              <p className="t-small text-mute">No notes yet.</p>
            ) : (
              <ol className="flex flex-col">
                {notes.map((n) => (
                  <li key={n.id} className="border-t border-line py-4">
                    <p className="whitespace-pre-wrap text-[14px]">{n.body}</p>
                    <p className="t-mono mt-2 text-mute">
                      {n.author || "Admin"} · {formatDateTime(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Pipeline">
            <form action={updateLeadAction} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={lead.id} />
              <Field label="Status">
                <Select name="status" defaultValue={lead.status} options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))} />
              </Field>
              <FormGrid className="md:grid-cols-1">
                <Field label="Name">
                  <Input name="name" defaultValue={lead.name} />
                </Field>
                <Field label="Email">
                  <Input name="email" type="email" defaultValue={lead.email} />
                </Field>
                <Field label="Organization">
                  <Input name="organization" defaultValue={lead.organization} />
                </Field>
                <Field label="Intent">
                  <Input name="intent" defaultValue={lead.intent} />
                </Field>
              </FormGrid>
              <div>
                <SubmitButton>Save</SubmitButton>
              </div>
            </form>
          </Panel>

          <Panel title="Danger zone">
            <form action={deleteLeadAction}>
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmButton message="Delete this lead and its notes?">Delete lead</ConfirmButton>
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
