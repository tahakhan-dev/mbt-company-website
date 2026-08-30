import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "MBT";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — AI Software House`,
    template: `%s — ${siteName}`,
  },
  description:
    "We design, engineer, and ship AI-powered products — LLM apps, data platforms, and fintech-grade software.",
};

export const viewport: Viewport = {
  themeColor: "#05070C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontClassNames}>
      <body>
        {children}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
