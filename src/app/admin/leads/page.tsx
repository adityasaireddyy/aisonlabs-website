import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LEAD_STATUSES, listLeads, type LeadStatus } from "@/lib/db/crm";
import { formatDateTime } from "@/lib/markdown";
import { AdminHeader, Badge, Empty, Field, FormGrid, Input, LinkButton, Panel, Select, Textarea, statusTone } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/client";
import { createLeadAction } from "../actions";
import { cn } from "@/lib/utils";

const INTENTS = ["A custom system for my organization", "Aison Edu for my institution", "A product idea", "Research or collaboration", "Something else"];

export default async function LeadsPage(props: PageProps<"/admin/leads">) {
  await requireAdmin();
  const sp = await props.searchParams;
  const status = (typeof sp.status === "string" ? sp.status : "all") as LeadStatus | "all";
  const q = typeof sp.q === "string" ? sp.q : "";
  const showNew = sp.new === "1";
  const leads = await listLeads({ status, q });

  return (
    <>
      <AdminHeader
        eyebrow="CRM"
        title="Leads"
        description="Every contact-form enquiry lands here as a lead. Move it through the pipeline, keep notes, and export when you need a spreadsheet."
        actions={
          <>
            <LinkButton href={`/admin/leads/export${status !== "all" ? `?status=${status}` : ""}`}>Export CSV</LinkButton>
            <LinkButton href="/admin/leads?new=1" primary>
              New lead
            </LinkButton>
          </>
        }
      />

      {showNew && (
        <Panel title="Add a lead manually" className="mb-8">
          <ActionForm action={createLeadAction} submitLabel="Create lead">
            <FormGrid>
              <Field label="Name">
                <Input name="name" required />
              </Field>
              <Field label="Email">
                <Input name="email" type="email" required />
              </Field>
              <Field label="Organization">
                <Input name="organization" />
              </Field>
              <Field label="Intent">
                <Select name="intent" options={[{ value: "", label: "—" }, ...INTENTS.map((i) => ({ value: i, label: i }))]} />
              </Field>
              <Field label="Source">
                <Input name="source" placeholder="referral, event, email…" defaultValue="manual" />
              </Field>
              <Field label="Status">
                <Select name="status" options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))} />
              </Field>
            </FormGrid>
            <Field label="Notes / message">
              <Textarea name="message" rows={4} />
            </Field>
          </ActionForm>
        </Panel>
      )}

      <form className="mb-6 flex flex-wrap items-center gap-2" method="get">
        <div className="flex flex-wrap gap-1">
          {(["all", ...LEAD_STATUSES] as const).map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
              className={cn("t-mono border px-3 py-2 transition-colors", status === s ? "border-fg bg-fg text-bg" : "border-line text-mute hover:border-fg hover:text-fg")}
            >
              {s}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <Input name="q" defaultValue={q} placeholder="Search name, org, email, message" className="h-10 w-72 py-0" />
          <button type="submit" className="t-mono h-10 border border-line-strong px-4 hover:border-fg">
            Search
          </button>
        </div>
      </form>

      {leads.length === 0 ? (
        <Empty>No leads match.</Empty>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Organization</th>
                <th>Intent</th>
                <th>Source</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link href={`/admin/leads/${l.id}`} className="font-medium hover:underline">
                      {l.name}
                    </Link>
                    <span className="block text-[12px] text-mute">{l.email}</span>
                  </td>
                  <td className="text-[13px]">{l.organization || "—"}</td>
                  <td className="max-w-[16rem] text-[13px] text-mute">{l.intent || "—"}</td>
                  <td className="t-mono text-mute">{l.source}</td>
                  <td>
                    <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                  </td>
                  <td className="t-mono whitespace-nowrap text-mute">{formatDateTime(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
