import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "__session";
const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export type AdminIdentity = { uid: string; email: string };

/**
 * Full server-side verification: session cookie signature + revocation check
 * + the `admin` custom claim. Called by every admin page AND every privileged
 * server action — the proxy redirect is assumed bypassable.
 */
export async function verifyAdmin(): Promise<AdminIdentity | null> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    if (decoded.admin !== true) return null;
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}

/** Page-level guard: redirects to login when the session is invalid. */
export async function requireAdminPage(): Promise<AdminIdentity> {
  const identity = await verifyAdmin();
  if (!identity) redirect("/admin/login");
  return identity;
}

/** Action-level guard: throws (never redirects) so callers fail closed. */
export async function requireAdmin(): Promise<AdminIdentity> {
  const identity = await verifyAdmin();
  if (!identity) throw new Error("UNAUTHORIZED");
  return identity;
}

export async function createSessionCookieFromIdToken(idToken: string): Promise<string | null> {
  const auth = adminAuth();
  // Verify first so only fresh, admin-claimed tokens become sessions.
  const decoded = await auth.verifyIdToken(idToken, true);
  if (decoded.admin !== true) return null;
  // Require recent sign-in (defense against replayed old tokens).
  if (Date.now() / 1000 - decoded.auth_time > 5 * 60) return null;
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
}

export async function revokeSession(): Promise<void> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE)?.value;
  if (cookie) {
    try {
      const decoded = await adminAuth().verifySessionCookie(cookie);
      await adminAuth().revokeRefreshTokens(decoded.uid);
    } catch {
      // Already invalid — nothing to revoke.
    }
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  maxAge: SESSION_DURATION_MS / 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
