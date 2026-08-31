import type { APIRoute } from "astro";
import {
  createSession,
  originAllowed,
  revokeAndClear,
  setSessionCookie,
  signInWithPassword,
} from "~/lib/admin/auth";

export const prerender = false;

// ponytail: in-process login throttle; per-instance, enough for one admin.
const attempts = new Map<string, number[]>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  list.push(now);
  attempts.set(ip, list);
  return list.length > 10;
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  if (!originAllowed(request)) return new Response(null, { status: 403 });

  const form = await request.formData();
  if (form.get("intent") === "logout") {
    await revokeAndClear(cookies);
    return redirect("/admin/login", 303);
  }

  if (throttled(clientAddress ?? "unknown")) {
    return redirect("/admin/login?error=1", 303);
  }

  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return redirect("/admin/login?error=1", 303);

  const signedIn = await signInWithPassword(email, password);
  if ("error" in signedIn) return redirect("/admin/login?error=1", 303);

  const session = await createSession(signedIn.idToken);
  if (!session) return redirect("/admin/login?error=1", 303);

  setSessionCookie(cookies, session);
  return redirect("/admin", 303);
};
