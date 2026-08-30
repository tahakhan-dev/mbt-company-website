"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSettings } from "@/lib/admin/actions";
import { siteSettingsSchema, type SiteSettings } from "@/lib/schemas/settings";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminTextarea,
  FieldRow,
} from "@/components/admin/ui";
import { ArrayEditor } from "@/components/admin/ArrayEditor";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    if (busy) return;
    const parsed = siteSettingsSchema.safeParse(draft);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      toast.error(`${issue?.path.join(".") || "field"}: ${issue?.message ?? "invalid"}`);
      return;
    }
    setBusy(true);
    const result = await updateSettings(parsed.data);
    setBusy(false);
    if (result.ok) {
      toast.success("Settings saved — live site updated");
      router.refresh();
    } else toast.error(result.error);
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <AdminCard title="Brand">
        <div className="space-y-4">
          <FieldRow>
            <div>
              <AdminLabel htmlFor="st-name">Site name</AdminLabel>
              <AdminInput id="st-name" required value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="st-tagline">Tagline</AdminLabel>
              <AdminInput id="st-tagline" value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </div>
          </FieldRow>
          <FieldRow>
            <div>
              <AdminLabel htmlFor="st-markets">Primary markets</AdminLabel>
              <AdminInput id="st-markets" value={draft.markets} onChange={(e) => set("markets", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="st-promise">Response promise</AdminLabel>
              <AdminInput id="st-promise" value={draft.responsePromise} onChange={(e) => set("responsePromise", e.target.value)} />
            </div>
          </FieldRow>
        </div>
      </AdminCard>

      <AdminCard title="Hero copy">
        <div className="space-y-4">
          <FieldRow>
            <div>
              <AdminLabel htmlFor="st-eyebrow">Eyebrow</AdminLabel>
              <AdminInput id="st-eyebrow" value={draft.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="st-trust">Trust line (mono row under CTAs)</AdminLabel>
              <AdminInput id="st-trust" value={draft.trustLine} onChange={(e) => set("trustLine", e.target.value)} />
            </div>
          </FieldRow>
          <div>
            <AdminLabel htmlFor="st-headline">Headline</AdminLabel>
            <AdminInput id="st-headline" value={draft.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
          </div>
          <div>
            <AdminLabel htmlFor="st-subline">Subline</AdminLabel>
            <AdminTextarea id="st-subline" rows={2} value={draft.heroSubline} onChange={(e) => set("heroSubline", e.target.value)} />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Contact & booking">
        <div className="space-y-4">
          <FieldRow cols={3}>
            <div>
              <AdminLabel htmlFor="st-email">Contact email</AdminLabel>
              <AdminInput id="st-email" type="email" required value={draft.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="st-wa" hint="international format, digits only">WhatsApp</AdminLabel>
              <AdminInput id="st-wa" placeholder="9715xxxxxxxx (empty = hidden)" value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </div>
            <div>
              <AdminLabel htmlFor="st-cal" hint="empty = contact form">Calendly URL</AdminLabel>
              <AdminInput id="st-cal" type="url" placeholder="https://calendly.com/…" value={draft.calendlyUrl} onChange={(e) => set("calendlyUrl", e.target.value)} />
            </div>
          </FieldRow>
          <FieldRow cols={3}>
            <div>
              <AdminLabel htmlFor="st-li">LinkedIn</AdminLabel>
              <AdminInput id="st-li" type="url" value={draft.socials.linkedin} onChange={(e) => set("socials", { ...draft.socials, linkedin: e.target.value })} />
            </div>
            <div>
              <AdminLabel htmlFor="st-gh">GitHub</AdminLabel>
              <AdminInput id="st-gh" type="url" value={draft.socials.github} onChange={(e) => set("socials", { ...draft.socials, github: e.target.value })} />
            </div>
            <div>
              <AdminLabel htmlFor="st-x">X</AdminLabel>
              <AdminInput id="st-x" type="url" value={draft.socials.x} onChange={(e) => set("socials", { ...draft.socials, x: e.target.value })} />
            </div>
          </FieldRow>
        </div>
      </AdminCard>

      <AdminCard title="SEO defaults">
        <div className="space-y-4">
          <FieldRow>
            <div>
              <AdminLabel htmlFor="st-title" hint="%s = page title">Title template</AdminLabel>
              <AdminInput id="st-title" value={draft.seo.titleTemplate} onChange={(e) => set("seo", { ...draft.seo, titleTemplate: e.target.value })} />
            </div>
            <div>
              <AdminLabel htmlFor="st-og" hint="empty = generated brand OG image">OG image URL</AdminLabel>
              <AdminInput id="st-og" value={draft.seo.ogImage} onChange={(e) => set("seo", { ...draft.seo, ogImage: e.target.value })} />
            </div>
          </FieldRow>
          <div>
            <AdminLabel htmlFor="st-desc">Default description</AdminLabel>
            <AdminTextarea id="st-desc" rows={2} value={draft.seo.description} onChange={(e) => set("seo", { ...draft.seo, description: e.target.value })} />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Metrics band (home)">
        <ArrayEditor
          addLabel="Add metric"
          max={4}
          columns={[
            { key: "value", label: "Value (number counts up)", width: "170px" },
            { key: "suffix", label: "Suffix (+, %)", width: "110px" },
            { key: "label", label: "Label" },
          ]}
          value={draft.metrics.map((m) => ({ value: m.value, suffix: m.suffix, label: m.label }))}
          onChange={(rows) => set("metrics", rows.map((r) => ({ value: r.value ?? "", suffix: r.suffix ?? "", label: r.label ?? "" })))}
        />
      </AdminCard>

      <AdminCard title="Home FAQs">
        <ArrayEditor
          addLabel="Add FAQ"
          max={6}
          columns={[
            { key: "question", label: "Question", width: "280px" },
            { key: "answer", label: "Answer", type: "textarea" },
          ]}
          value={draft.homeFaqs}
          onChange={(rows) => set("homeFaqs", rows.map((r) => ({ question: r.question ?? "", answer: r.answer ?? "" })))}
        />
      </AdminCard>

      <AdminCard title="Announcement pill (optional)">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={draft.announcement.enabled}
              onChange={(e) => set("announcement", { ...draft.announcement, enabled: e.target.checked })}
              className="size-4 accent-[#22d3ee]"
            />
            Show announcement
          </label>
          <FieldRow>
            <div>
              <AdminLabel htmlFor="st-ann">Text</AdminLabel>
              <AdminInput id="st-ann" value={draft.announcement.text} onChange={(e) => set("announcement", { ...draft.announcement, text: e.target.value })} />
            </div>
            <div>
              <AdminLabel htmlFor="st-ann-href">Link</AdminLabel>
              <AdminInput id="st-ann-href" value={draft.announcement.href} onChange={(e) => set("announcement", { ...draft.announcement, href: e.target.value })} />
            </div>
          </FieldRow>
        </div>
      </AdminCard>

      <div className="sticky bottom-0 -mx-5 border-t border-white/8 bg-void/90 px-5 py-3 backdrop-blur-md md:-mx-8 md:px-8">
        <AdminButton type="submit" variant="primary" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </AdminButton>
      </div>
    </form>
  );
}
