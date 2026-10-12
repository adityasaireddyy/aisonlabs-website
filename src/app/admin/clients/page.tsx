import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listClients } from "@/lib/db/content";
import { AdminHeader, Badge, Empty, LinkButton } from "@/components/admin/ui";

export default async function AdminClients() {
  await requireAdmin();
  const clients = await listClients();
  return (
    <>
      <AdminHeader
        eyebrow="Content"
        title="Clients"
        description="Service clients and product deployments shown on the home page, /work and /products/aison-edu. Keep the two kinds distinct."
        actions={
          <LinkButton href="/admin/clients/new" primary>
            Add client
          </LinkButton>
        }
      />
      {clients.length === 0 ? (
        <Empty>No clients listed.</Empty>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Kind</th>
                <th>Product</th>
                <th>Case study</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="t-mono text-mute">{c.sortOrder}</td>
                  <td>
                    <Link href={`/admin/clients/${c.id}`} className="font-medium hover:underline">
                      {c.name}
                    </Link>
                    {c.descriptor && <span className="block text-[12px] text-mute">{c.descriptor}</span>}
                  </td>
                  <td>
                    <Badge tone={c.kind === "product-deployment" ? "accent" : "fg"}>{c.kind === "product-deployment" ? "deployment" : "service"}</Badge>
                  </td>
                  <td className="text-[13px]">{c.product || "—"}</td>
                  <td className="text-[13px] text-mute">{c.caseHref || c.caseSummary ? "Yes" : "Soon"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
