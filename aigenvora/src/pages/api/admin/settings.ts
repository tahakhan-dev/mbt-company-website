import type { APIRoute } from "astro";
import { z } from "zod";
import { adminDb, col } from "~/lib/firebase/server";
import { originAllowed } from "~/lib/admin/auth";
import { audit } from "~/lib/admin/audit";
import { bust } from "~/lib/content/cache";

export const prerender = false;

const settingsSchema = z.object({
  name: z.string().trim().min(1).max(100),
  descriptor: z.string().trim().min(1).max(200),
  contactEmail: z.email(),
  responseExpectation: z.string().trim().min(1).max(300),
  cta: z.string().trim().min(1).max(80),
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });
  const admin = locals.admin!;
  const parsed = settingsSchema.safeParse(Object.fromEntries((await request.formData()).entries()));
  if (!parsed.success) return redirect("/admin/settings?error=1", 303);

  await adminDb()
    .collection(col("settings"))
    .doc("site")
    .set({ ...parsed.data, updatedAt: new Date().toISOString() }, { merge: true });
  bust("content:");
  await audit(admin.email, "settings.update", "site");
  return redirect("/admin/settings?saved=1", 303);
};
