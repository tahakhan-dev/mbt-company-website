import type { Metadata, Viewport } from "next";
import { fontClassNames } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "MBT";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} · AI Software House`,
    template: `%s · ${siteName}`,
  },
  description:
    "We design, engineer, and ship AI-powered products: LLM apps, data platforms, and fintech-grade software.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070c" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes stamps the resolved theme class on
    // <html> before hydration (its inline script) — expected server/client diff.
    <html lang="en" className={fontClassNames} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <div className="noise-overlay" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}
