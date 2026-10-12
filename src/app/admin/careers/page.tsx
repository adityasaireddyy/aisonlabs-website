import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listJobs } from "@/lib/db/content";
import { listApplications } from "@/lib/db/crm";
import { formatDate } from "@/lib/markdown";
import { AdminHeader, Badge, Empty, LinkButton, statusTone } from "@/components/admin/ui";

export default async function AdminCareers() {
  await requireAdmin();
  const [jobs, apps] = await Promise.all([listJobs(), listApplications()]);
  const countFor = (id: string) => apps.filter((a) => a.jobId === id).length;
  return (
    <>
      <AdminHeader
        eyebrow="Content"
        title="Careers"
        description="Roles marked open are listed on /careers with an application form. Closed roles keep their applications."
        actions={
          <LinkButton href="/admin/careers/new" primary>
            New role
          </LinkButton>
        }
      />
      {jobs.length === 0 ? (
        <Empty>No roles yet. The careers page shows an open application form until you add one.</Empty>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Team</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td>
                    <Link href={`/admin/careers/${j.id}`} className="font-medium hover:underline">
                      {j.title}
                    </Link>
                    <span className="t-mono block text-mute">/careers/{j.slug}</span>
                  </td>
                  <td className="text-[13px]">{j.team || "—"}</td>
                  <td className="text-[13px]">{j.location || "—"}</td>
                  <td className="text-[13px]">{j.type}</td>
                  <td>
                    <Badge tone={statusTone(j.status)}>{j.status}</Badge>
                  </td>
                  <td>
                    <Link href={`/admin/applications`} className="tabular hover:underline">
                      {countFor(j.id)}
                    </Link>
                  </td>
                  <td className="t-mono text-mute">{formatDate(j.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
