import type { APIRoute } from "astro";
import { getServices } from "~/lib/content/queries";
import { getPortfolio } from "~/lib/content/portfolio";
import { env } from "~/env";

export const prerender = false;

export const GET: APIRoute = async () => {
  const base = env.PUBLIC_SITE_URL;
  const services = await getServices();
  const routes = [
    "/",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/work",
    ...getPortfolio().map((p) => `/work/${p.slug}`),
    "/mvps",
    "/about",
    "/contact",
    "/privacy",
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${base}${r}</loc></url>`).join("\n")}
</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
