import { defineMiddleware } from "astro:middleware";
import { verifySession } from "~/lib/admin/auth";

/**
 * Route guard: everything under /admin (except the login screen) and
 * /api/admin requires a valid, unrevoked admin session. Admin surfaces are
 * never indexed.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/session";

  if (isAdminPage || isAdminApi) {
    const identity = await verifySession(context.cookies);
    if (!identity) {
      if (isAdminApi) return new Response(JSON.stringify({ ok: false }), { status: 401 });
      return context.redirect("/admin/login");
    }
    context.locals.admin = identity;
  }

  const response = await next();
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
  }
  return response;
});
