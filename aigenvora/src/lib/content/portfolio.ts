import raw from "./portfolio-content.json";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The 13 shipped products — published on the owner's explicit directive
 * (2026-09-01, in-session; recorded in docs/research/PORTFOLIO-SOURCE-LEDGER.md).
 * Copy derives from each product's public feature set; metrics are the
 * owner-supplied figures, each carrying its source label. Screenshots were
 * captured from the official sites (scripts/capture-portfolio.mjs).
 */

export interface PortfolioMetric {
  label: string;
  value: string;
  source: string;
}

export interface PortfolioProject {
  slug: string;
  name: string;
  url: string;
  category: string;
  serviceSlug: string;
  accent: "electric" | "violet" | "lime";
  oneLiner: string;
  story: { what: string; built: string; capabilities: string[] };
  metrics: PortfolioMetric[];
  heroImage: string | null;
  midImage: string | null;
  /** Live external link — null when the product has no reachable listing. */
  liveUrl: string | null;
}

const ACCENT_HEX: Record<PortfolioProject["accent"], string> = {
  electric: "#1A39FF",
  violet: "#7957FF",
  lime: "#8fb62b",
};

/** ChatBuddy's store listing is offline (owner to supply the App Store URL). */
const NO_LIVE_LINK = new Set(["chatbuddy"]);

const mediaDir = join(process.cwd(), "public", "media", "portfolio");

function mediaOrNull(file: string): string | null {
  return existsSync(join(mediaDir, file)) ? `/media/portfolio/${file}` : null;
}

const projects: PortfolioProject[] = (raw as Omit<PortfolioProject, "heroImage" | "midImage" | "liveUrl">[]).map(
  (p) => ({
    ...p,
    heroImage: mediaOrNull(`${p.slug}-hero.webp`),
    midImage: mediaOrNull(`${p.slug}-mid.webp`),
    liveUrl: NO_LIVE_LINK.has(p.slug) ? null : p.url,
  }),
);

export function getPortfolio(): PortfolioProject[] {
  return projects;
}

export function getPortfolioProject(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPortfolioByService(serviceSlug: string): PortfolioProject[] {
  return projects.filter((p) => p.serviceSlug === serviceSlug);
}

export function nextPortfolioProject(slug: string): PortfolioProject {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length]!;
}

export function accentHex(accent: PortfolioProject["accent"]): string {
  return ACCENT_HEX[accent];
}
