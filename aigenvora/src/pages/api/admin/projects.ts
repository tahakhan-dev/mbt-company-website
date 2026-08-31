import type { APIRoute } from "astro";
import { z } from "zod";
import { adminDb, col } from "~/lib/firebase/server";
import { originAllowed } from "~/lib/admin/auth";
import { audit } from "~/lib/admin/audit";
import { bust } from "~/lib/content/cache";

export const prerender = false;

const formSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(200),
  outcome: z.string().trim().min(1).max(400),
  category: z.string().trim().min(1).max(120),
  role: z.string().trim().max(300).optional(),
  engagementModel: z.string().trim().max(200).optional(),
  officialUrl: z.union([z.url(), z.literal("")]).optional(),
  status: z.enum(["draft", "published", "archived"]),
  ownershipVerified: z.coerce.boolean().default(false),
  clientPermission: z.coerce.boolean().default(false),
  verifiedBy: z.string().trim().max(200).optional(),
  permissionReference: z.string().trim().max(500).optional(),
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });
  const admin = locals.admin!;
  const raw = Object.fromEntries((await request.formData()).entries());
  raw["ownershipVerified"] = raw["ownershipVerified"] === "on" ? "true" : "";
  raw["clientPermission"] = raw["clientPermission"] === "on" ? "true" : "";
  const parsed = formSchema.safeParse(raw);
  if (!parsed.success) return redirect("/admin/projects?error=invalid", 303);
  const data = parsed.data;

  // THE integrity gate (spec §14.1/§20.6): publication is impossible without
  // verified ownership, client permission, and a stated role. Server-side,
  // no admin-UI bypass.
  if (
    data.status === "published" &&
    !(data.ownershipVerified && data.clientPermission && (data.role ?? "").trim().length > 0)
  ) {
    return redirect("/admin/projects?error=verification", 303);
  }

  await adminDb()
    .collection(col("projects"))
    .doc(data.slug)
    .set(
      {
        ...data,
        verifiedAt: data.ownershipVerified ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  bust("content:");
  await audit(admin.email, "project.update", data.slug, {
    status: data.status,
    ownershipVerified: data.ownershipVerified,
    clientPermission: data.clientPermission,
  });
  return redirect(`/admin/projects?saved=${data.slug}`, 303);
};
