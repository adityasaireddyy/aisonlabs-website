import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { contentCounts } from "@/lib/db/content";
import { crmCounts, listApplications, listLeads } from "@/lib/db/crm";
import { formatDateTime } from "@/lib/markdown";
import { AdminHeader, Badge, Empty, LinkButton, Panel, Stat, statusTone } from "@/components/admin/ui";

export default async function AdminDashboard() {
  await requireAdmin();
  const [crm, content, leads, apps] = await Promise.all([crmCounts(), contentCounts(), listLeads(), listApplications()]);

  return (
    <>
      <AdminHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Everything that reaches the site lands here: enquiries from the contact form, job applications, and the content the site publishes."
        actions={
          <>
            <LinkButton href="/admin/blog/new">New post</LinkButton>
            <LinkButton href="/admin/leads?new=1" primary>
              New lead
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New leads" value={crm.leadsNew} hint={`of ${crm.leads}`} href="/admin/leads?status=new" />
        <Stat label="New applications" value={crm.applicationsNew} hint={`of ${crm.applications}`} href="/admin/applications?status=new" />
        <Stat label="Published posts" value={content.postsPublished} hint={`of ${content.posts}`} href="/admin/blog" />
        <Stat label="Open roles" value={content.jobsOpen} href="/admin/careers" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="Recent leads">
          {leads.length === 0 ? (
            <Empty>No leads yet. Contact form submissions appear here.</Empty>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>Intent</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 8).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/admin/leads/${l.id}`} className="font-medium hover:underline">
                        {l.name}
                      </Link>
                      <span className="block text-[12px] text-mute">{l.organization || l.email}</span>
                    </td>
                    <td className="text-[13px] text-mute">{l.intent || "—"}</td>
                    <td>
                      <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                    </td>
                    <td className="t-mono whitespace-nowrap text-mute">{formatDateTime(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title="Recent applications">
          {apps.length === 0 ? (
            <Empty>No applications yet. Careers form submissions appear here.</Empty>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {apps.slice(0, 8).map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/admin/applications/${a.id}`} className="font-medium hover:underline">
                        {a.name}
                      </Link>
                      <span className="block text-[12px] text-mute">{a.email}</span>
                    </td>
                    <td className="text-[13px] text-mute">{a.jobTitle}</td>
                    <td>
                      <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                    </td>
                    <td className="t-mono whitespace-nowrap text-mute">{formatDateTime(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Research articles" value={content.articles} href="/admin/research" />
        <Stat label="Clients listed" value={content.clients} href="/admin/clients" />
        <Stat label="Leads won" value={crm.leadsWon} href="/admin/leads?status=won" />
      </div>
    </>
  );
}
