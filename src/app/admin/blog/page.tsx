import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listPosts } from "@/lib/db/content";
import { formatDate } from "@/lib/markdown";
import { AdminHeader, Badge, Empty, LinkButton, statusTone } from "@/components/admin/ui";

export default async function AdminBlog() {
  await requireAdmin();
  const posts = await listPosts();
  return (
    <>
      <AdminHeader
        eyebrow="Content"
        title="Blog"
        description="Posts appear on /blog when published. Drafts are only visible here."
        actions={
          <LinkButton href="/admin/blog/new" primary>
            New post
          </LinkButton>
        }
      />
      {posts.length === 0 ? (
        <Empty>No posts yet. Write the first one.</Empty>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/blog/${p.id}`} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                    <span className="t-mono block text-mute">/blog/{p.slug}</span>
                  </td>
                  <td className="text-[13px]">{p.category || "—"}</td>
                  <td>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  </td>
                  <td className="t-mono text-mute">{formatDate(p.publishedAt) || "—"}</td>
                  <td className="t-mono text-mute">{formatDate(p.updatedAt)}</td>
                  <td className="text-right">
                    {p.status === "published" && (
                      <Link href={`/blog/${p.slug}`} target="_blank" className="t-mono text-mute hover:text-fg">
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
