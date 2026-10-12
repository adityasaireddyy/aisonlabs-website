import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { APPLICATION_STATUSES, listApplications, type ApplicationStatus } from "@/lib/db/crm";
import { formatDateTime } from "@/lib/markdown";
import { AdminHeader, Badge, Empty, LinkButton, statusTone } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default async function ApplicationsPage(props: PageProps<"/admin/applications">) {
  await requireAdmin();
  const sp = await props.searchParams;
  const status = (typeof sp.status === "string" ? sp.status : "all") as ApplicationStatus | "all";
  const apps = await listApplications({ status });

  return (
    <>
      <AdminHeader
        eyebrow="CRM"
        title="Applications"
        description="Submissions from the careers pages, for open roles and open applications."
        actions={<LinkButton href="/admin/careers">Manage roles</LinkButton>}
      />
      <div className="mb-6 flex flex-wrap gap-1">
        {(["all", ...APPLICATION_STATUSES] as const).map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/applications" : `/admin/applications?status=${s}`}
            className={cn("t-mono border px-3 py-2 transition-colors", status === s ? "border-fg bg-fg text-bg" : "border-line text-mute hover:border-fg hover:text-fg")}
          >
            {s}
          </Link>
        ))}
      </div>
      {apps.length === 0 ? (
        <Empty>No applications match.</Empty>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Links</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/applications/${a.id}`} className="font-medium hover:underline">
                      {a.name}
                    </Link>
                    <span className="block text-[12px] text-mute">{a.email}</span>
                  </td>
                  <td className="text-[13px]">{a.jobTitle}</td>
                  <td className="max-w-[16rem] truncate text-[12px] text-mute">{a.links || "—"}</td>
                  <td>
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </td>
                  <td className="t-mono whitespace-nowrap text-mute">{formatDateTime(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
