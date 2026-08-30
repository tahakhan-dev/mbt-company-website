import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use",
  description: "Terms governing the use of this website.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-36 md:px-8 md:pt-44">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-6 font-display text-display font-medium">Terms of Use</h1>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        Last updated: August 30, 2026
      </p>

      <div className="rich-text mt-12">
        <p>
          These terms govern your use of this website, operated by {settings.name}. By using
          the site you accept them.
        </p>

        <h2>Use of the site</h2>
        <p>
          The site and its content are provided for information about our services. You may
          browse, link to, and quote it with attribution. You may not scrape it at scale,
          attempt to breach its security, or misrepresent its content as your own.
        </p>

        <h2>Content and case studies</h2>
        <p>
          Case studies describe real categories of work; where clients are confidential,
          figures are representative and identifying details are changed or withheld. Sample
          content is marked as such. Nothing on this site constitutes a binding offer;
          engagements are governed by individually signed agreements.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The site design, text, and generated artwork are © {new Date().getFullYear()}{" "}
          {settings.name}. Client names, product names, and trademarks referenced on the site
          belong to their respective owners.
        </p>

        <h2>No warranties; limitation of liability</h2>
        <p>
          The site is provided “as is”, without warranties of any kind. To the maximum extent
          permitted by law, {settings.name} is not liable for damages arising from use of the
          site or reliance on its content.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
        </p>
      </div>
    </div>
  );
}
