import type { APIRoute } from "astro";
import { z } from "zod";
import { adminDb, col } from "~/lib/firebase/server";
import { originAllowed } from "~/lib/admin/auth";
import { audit } from "~/lib/admin/audit";
import { bust } from "~/lib/content/cache";
import { SERVICES } from "~/lib/content/defaults";

export const prerender = false;

const patchSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(200),
  outcome: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(2000),
  status: z.enum(["draft", "published", "archived"]),
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });
  const admin = locals.admin!;
  const form = Object.fromEntries((await request.formData()).entries());
  const parsed = patchSchema.safeParse(form);
  if (!parsed.success) return redirect(`/admin/services?error=1`, 303);
  const { slug, ...patch } = parsed.data;
  if (!SERVICES.some((s) => s.slug === slug)) return redirect(`/admin/services?error=1`, 303);

  await adminDb()
    .collection(col("services"))
    .doc(slug)
    .set({ ...patch, updatedAt: new Date().toISOString() }, { merge: true });
  bust("content:");
  await audit(admin.email, "service.update", slug, { status: patch.status });
  return redirect(`/admin/services?saved=${slug}`, 303);
};
