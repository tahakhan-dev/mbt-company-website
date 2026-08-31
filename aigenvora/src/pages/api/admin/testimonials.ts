import type { APIRoute } from "astro";
import { z } from "zod";
import { adminDb, col } from "~/lib/firebase/server";
import { originAllowed } from "~/lib/admin/auth";
import { audit } from "~/lib/admin/audit";
import { bust } from "~/lib/content/cache";

export const prerender = false;

const schema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  quote: z.string().trim().min(1).max(1000),
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().max(120).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  videoUrl: z.union([z.url(), z.literal("")]).optional().default(""),
  status: z.enum(["draft", "published", "archived"]),
  order: z.coerce.number().int().min(0).max(99).default(50),
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });
  const admin = locals.admin!;
  const form = Object.fromEntries((await request.formData()).entries());

  if (form["intent"] === "delete" && typeof form["id"] === "string") {
    await adminDb().collection(col("testimonials")).doc(String(form["id"])).delete();
    bust("content:");
    await audit(admin.email, "testimonial.delete", String(form["id"]));
    return redirect("/admin/testimonials", 303);
  }

  const parsed = schema.safeParse(form);
  if (!parsed.success) return redirect("/admin/testimonials?error=1", 303);
  const { id, ...data } = parsed.data;
  await adminDb()
    .collection(col("testimonials"))
    .doc(id)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
  bust("content:");
  await audit(admin.email, "testimonial.update", id, { status: data.status });
  return redirect(`/admin/testimonials?saved=${id}`, 303);
};
