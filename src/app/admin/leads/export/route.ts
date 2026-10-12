import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { leadsToCsv, listLeads, type LeadStatus } from "@/lib/db/crm";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const status = (url.searchParams.get("status") ?? "all") as LeadStatus | "all";
  const csv = leadsToCsv(await listLeads({ status }));
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="aison-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
