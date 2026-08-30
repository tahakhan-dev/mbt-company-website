import type { Metadata } from "next";
import { adminListTestimonials } from "@/lib/admin/queries";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await adminListTestimonials();
  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold">Testimonials</h1>
      <SimpleCrud
        collection="testimonials"
        items={testimonials}
        titleKey="author"
        subtitleKey="company"
        addLabel="Add testimonial"
        emptyTitle="No testimonials yet"
        emptyDetail="Quotes shown on the home page — the first (by order) renders as the wide feature card."
        base={{ quote: "", author: "", role: "", company: "", avatarUrl: "", visible: true, order: (testimonials.length + 1) * 10 }}
        fields={[
          { key: "quote", label: "Quote", type: "textarea", required: true },
          { key: "author", label: "Author", type: "text", required: true },
          { key: "role", label: "Role", type: "text", placeholder: "CTO" },
          { key: "company", label: "Company", type: "text" },
          { key: "avatarUrl", label: "Avatar URL", type: "url", placeholder: "empty = generated monogram" },
          { key: "visible", label: "Visible on the site", type: "checkbox" },
        ]}
      />
    </div>
  );
}
