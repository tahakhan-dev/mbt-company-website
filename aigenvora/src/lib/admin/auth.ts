import type { AstroCookies } from "astro";
import { adminAuth } from "~/lib/firebase/server";
import { env, firebaseApiKey } from "~/env";

/**
 * Admin auth — server-only, no client Firebase SDK anywhere.
 * Login: Identity Toolkit REST signInWithPassword → Admin SDK session cookie
 * (14 days, rotated on every login). Every privileged request re-verifies the
 * cookie with revocation checking AND the `admin` custom claim — the same
 * posture the legacy app proved (CURRENT-SITE-AUDIT §3).
 */

export const SESSION_COOKIE = "__session";
const SESSION_DAYS = 14;

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ idToken: string } | { error: string }> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  if (!res.ok) return { error: "invalid" }; // generic — no user/password oracle
  const data = (await res.json()) as { idToken?: string };
  if (!data.idToken) return { error: "invalid" };
  return { idToken: data.idToken };
}

export async function createSession(idToken: string): Promise<string | null> {
  const auth = adminAuth();
  const decoded = await auth.verifyIdToken(idToken);
  if (decoded["admin"] !== true) return null;
  // Fresh-auth requirement: session cookies mint only from a recent sign-in.
  if (Date.now() / 1000 - decoded.auth_time > 5 * 60) return null;
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_DAYS * 24 * 60 * 60 * 1000 });
}

export interface AdminIdentity {
  uid: string;
  email: string;
}

export async function verifySession(cookies: AstroCookies): Promise<AdminIdentity | null> {
  const cookie = cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true /* checkRevoked */);
    if (decoded["admin"] !== true) return null;
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}

export function setSessionCookie(cookies: AstroCookies, value: string): void {
  cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: env.PUBLIC_SITE_URL.startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function revokeAndClear(cookies: AstroCookies): Promise<void> {
  const cookie = cookies.get(SESSION_COOKIE)?.value;
  if (cookie) {
    try {
      const decoded = await adminAuth().verifySessionCookie(cookie);
      await adminAuth().revokeRefreshTokens(decoded.uid);
    } catch {
      // Already invalid — clearing is enough.
    }
  }
  cookies.delete(SESSION_COOKIE, { path: "/" });
}

/** CSRF floor for mutations: same-site cookie + explicit origin allow-list. */
export function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin form posts may omit it
  return [env.PUBLIC_SITE_URL, "http://localhost:4321"].some((a) => origin.startsWith(a));
}
