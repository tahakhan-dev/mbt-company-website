import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { defaultSiteSettings, siteSettingsSchema } from "@/lib/schemas/settings";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const snap = await adminDb().collection(col("settings")).doc("site").get();
  const parsed = siteSettingsSchema.safeParse(snap.data() ?? {});
  const settings = parsed.success ? parsed.data : defaultSiteSettings;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold">Site Settings</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Every field here updates the live site immediately on save — no redeploys.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
