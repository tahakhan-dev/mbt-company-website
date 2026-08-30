import type { Metadata } from "next";
import { adminListLogos } from "@/lib/admin/queries";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export const metadata: Metadata = { title: "Logos & Tech" };

export default async function AdminLogosPage() {
  const logos = await adminListLogos();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold">Logos & Tech marquee</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Items render as styled wordmarks (always crisp); an image URL overrides per item.
        </p>
      </div>
      <SimpleCrud
        collection="logos"
        items={logos}
        titleKey="name"
        addLabel="Add item"
        emptyTitle="No marquee items yet"
        emptyDetail="These appear in the trust bar under the hero."
        base={{ name: "", kind: "tech", imageUrl: "", visible: true, order: (logos.length + 1) * 10 }}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          {
            key: "kind",
            label: "Kind",
            type: "select",
            options: [
              { value: "tech", label: "Technology" },
              { value: "client", label: "Client" },
            ],
          },
          { key: "imageUrl", label: "Image URL (optional)", type: "url" },
          { key: "visible", label: "Visible on the site", type: "checkbox" },
        ]}
      />
    </div>
  );
}
