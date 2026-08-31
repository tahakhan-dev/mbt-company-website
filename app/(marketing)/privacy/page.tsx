import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How this site handles data: cookie-less first-party analytics, no ad trackers, no data sales.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-36 md:px-8 md:pt-44">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-6 font-display text-display font-medium">Privacy Policy</h1>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        Last updated: August 30, 2026
      </p>

      <div className="rich-text mt-12">
        <p>
          This policy describes how {settings.name} (“we”, “us”) handles information on this
          website. The short version: no advertising trackers, no third-party analytics
          services, no cookies for tracking, and we never sell data.
        </p>

        <h2>What we collect, and how</h2>
        <h3>1. First-party visitor analytics (anonymous)</h3>
        <p>
          We run our own privacy-preserving analytics to understand how the site is used. It
          works without cookies and without collecting personal information:
        </p>
        <ul>
          <li>
            A random identifier is stored in your browser’s local storage (not a cookie, never
            sent to third parties) so repeat visits can be counted. It contains no personal
            information and expires after 13 months.
          </li>
          <li>
            We record page views, approximate scroll depth, clicks on our own buttons and
            outbound links, time on page, referring site, and device class (mobile/desktop).
          </li>
          <li>
            Your IP address is used transiently to derive an approximate location (country and
            city) and the network operator’s name, and is then discarded. We store only a
            salted one-way hash, never the IP itself.
          </li>
          <li>
            Network information may be looked up via IPinfo’s IP Lite database; only the
            anonymized result is stored.
          </li>
          <li>
            We honor the browser signals <em>Do Not Track</em> and{" "}
            <em>Global Privacy Control</em>: when either is enabled, analytics does not run at
            all.
          </li>
          <li>Raw analytics data is automatically deleted after 90 days; only aggregated daily statistics are kept.</li>
        </ul>

        <h3>2. Information you send us</h3>
        <p>
          If you submit the contact form, we receive what you type: your name, email address,
          and project details, plus the pages you visited on this site so we can respond with
          context. We use it solely to reply and manage our conversation with you. It is
          stored in our CRM (Google Firebase, Google Cloud infrastructure) and retained until
          you ask us to delete it.
        </p>

        <h2>What we never do</h2>
        <ul>
          <li>No third-party advertising or analytics scripts (no Google Analytics, no pixels).</li>
          <li>No sale or sharing of personal data with data brokers.</li>
          <li>No cross-site tracking, fingerprinting, or profiling.</li>
        </ul>

        <h2>Service providers</h2>
        <p>
          The site is hosted on Netlify; data is stored on Google Firebase (Google Cloud);
          media is served by Cloudinary; IP-to-location lookups use IPinfo. Each processes
          data only as needed to provide their service.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request a copy or deletion of any personal data we hold about you (in
          practice: your contact-form submissions) by writing to{" "}
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>. We reply
          within one business day.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes materially, we will update this page and the “last updated”
          date above.
        </p>
      </div>
    </div>
  );
}
