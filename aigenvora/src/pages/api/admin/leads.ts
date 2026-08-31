import type { APIRoute } from "astro";
import { adminDb, col } from "~/lib/firebase/server";
import { originAllowed } from "~/lib/admin/auth";
import { audit } from "~/lib/admin/audit";
import { LEAD_STATUSES, type LeadStatus } from "~/lib/schemas/lead";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });
  const admin = locals.admin!;
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const intent = String(form.get("intent") ?? "update");
  if (!id) return redirect("/admin/leads", 303);

  const ref = adminDb().collection(col("leads")).doc(id);

  if (intent === "delete") {
    await ref.delete();
    await audit(admin.email, "lead.delete", id);
    return redirect("/admin/leads", 303);
  }

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  const status = String(form.get("status") ?? "");
  if ((LEAD_STATUSES as readonly string[]).includes(status)) patch["status"] = status as LeadStatus;
  if (form.has("notes")) patch["notes"] = String(form.get("notes")).slice(0, 5000);
  await ref.set(patch, { merge: true });
  await audit(admin.email, "lead.update", id, { status: patch["status"] });
  return redirect("/admin/leads", 303);
};

/** CSV export. */
export const GET: APIRoute = async () => {
  const snap = await adminDb().collection(col("leads")).orderBy("createdAt", "desc").get();
  const esc = (v: unknown): string => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["createdAt", "status", "name", "email", "company", "projectType", "budget", "message", "page", "notes"].join(","),
    ...snap.docs.map((d) => {
      const x = d.data();
      return [
        x["createdAt"], x["status"], x["name"], x["email"], x["company"],
        x["projectType"], x["budget"], x["message"], x["attribution"]?.["page"], x["notes"],
      ].map(esc).join(",");
    }),
  ];
  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=aigenvora-leads-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
};
