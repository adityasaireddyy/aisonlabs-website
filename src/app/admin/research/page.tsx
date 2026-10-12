import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listArticles } from "@/lib/db/content";
import { formatDate } from "@/lib/markdown";
import { AdminHeader, Badge, Empty, LinkButton, statusTone } from "@/components/admin/ui";

export default async function AdminResearch() {
  await requireAdmin();
  const articles = await listArticles();
  return (
    <>
      <AdminHeader
        eyebrow="Content"
        title="Research"
        description="Longer perspective pieces. Published articles appear on /research and in the horizontal section on the home page."
        actions={
          <LinkButton href="/admin/research/new" primary>
            New article
          </LinkButton>
        }
      />
      {articles.length === 0 ? (
        <Empty>No research articles.</Empty>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="t-mono text-mute">{a.number}</td>
                  <td>
                    <Link href={`/admin/research/${a.id}`} className="font-medium hover:underline">
                      {a.title}
                    </Link>
                    <span className="t-mono block text-mute">/research/{a.slug}</span>
                  </td>
                  <td className="text-[13px]">{a.category}</td>
                  <td>
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </td>
                  <td className="t-mono text-mute">{formatDate(a.publishedAt) || "—"}</td>
                  <td className="text-right">
                    {a.status === "published" && (
                      <Link href={`/research/${a.slug}`} target="_blank" className="t-mono text-mute hover:text-fg">
                        View ↗
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
