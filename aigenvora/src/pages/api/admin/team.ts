import type { APIRoute } from "astro";
import { z } from "zod";
import { adminDb, col } from "~/lib/firebase/server";
import { originAllowed } from "~/lib/admin/auth";
import { audit } from "~/lib/admin/audit";
import { bust } from "~/lib/content/cache";

export const prerender = false;

const schema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  bio: z.string().trim().max(600).optional().default(""),
  status: z.enum(["draft", "published", "archived"]),
  order: z.coerce.number().int().min(0).max(99).default(50),
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });
  const admin = locals.admin!;
  const form = Object.fromEntries((await request.formData()).entries());

  if (form["intent"] === "delete" && typeof form["id"] === "string") {
    await adminDb().collection(col("team")).doc(String(form["id"])).delete();
    bust("content:");
    await audit(admin.email, "team.delete", String(form["id"]));
    return redirect("/admin/team", 303);
  }

  const parsed = schema.safeParse(form);
  if (!parsed.success) return redirect("/admin/team?error=1", 303);
  const { id, ...data } = parsed.data;
  await adminDb()
    .collection(col("team"))
    .doc(id)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
  bust("content:");
  await audit(admin.email, "team.update", id);
  return redirect(`/admin/team?saved=${id}`, 303);
};
