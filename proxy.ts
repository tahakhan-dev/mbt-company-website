import { NextResponse, type NextRequest } from "next/server";

export const SESSION_COOKIE = "__session";

/**
 * Fast redirect for unauthenticated /admin traffic (cookie presence only —
 * cheap). Real verification (signature + revocation + admin claim) happens
 * in requireAdmin() inside every admin page and server action; this layer
 * is UX, not security.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!isLogin && !hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  if (isLogin && hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
