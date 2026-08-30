import { NextResponse, type NextRequest } from "next/server";
import {
  createSessionCookieFromIdToken,
  revokeSession,
  sessionCookieOptions,
} from "@/lib/admin/auth";

/** Exchange a fresh Firebase ID token (admin claim required) for a session cookie. */
export async function POST(request: NextRequest) {
  let idToken: string | undefined;
  try {
    const body = (await request.json()) as { idToken?: string };
    idToken = body.idToken;
  } catch {
    // fallthrough → generic error
  }
  // Small constant friction against brute-force loops.
  await new Promise((r) => setTimeout(r, 400));

  if (typeof idToken !== "string" || idToken.length < 100 || idToken.length > 8192) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const cookie = await createSessionCookieFromIdToken(idToken);
    if (!cookie) return NextResponse.json({ ok: false }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set({ ...sessionCookieOptions, value: cookie });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}

/** Logout: revoke refresh tokens and clear the cookie. */
export async function DELETE() {
  await revokeSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...sessionCookieOptions, value: "", maxAge: 0 });
  return res;
}
