"use server";

import { headers } from "next/headers";
import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { bustTag } from "@/lib/data/revalidate";
import { getSiteSettings } from "@/lib/data/content";
import { leadInputSchema, type Lead } from "@/lib/schemas/lead";

type LeadResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "Something went wrong. Please try again or email us directly.";

/** Naive per-instance rate limit: 5 submissions / 10 min / IP. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 10 * 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — trap-based protection only
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

async function sendLeadAlert(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const settings = await getSiteSettings();
    const to = process.env.LEAD_ALERT_EMAIL || settings.contactEmail;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: `${settings.name} website <onboarding@resend.dev>`,
        to: [to],
        subject: `New lead: ${lead.name} (${lead.services.join(", ") || "no service selected"})`,
        text: [
          `Name: ${lead.name}`,
          `Email: ${lead.email}`,
          `Services: ${lead.services.join(", ") || "—"}`,
          `Budget: ${lead.budget ?? "—"}`,
          "",
          lead.message,
          "",
          `Country: ${lead.attribution.country ?? "—"} · Path: ${lead.attribution.path ?? "—"}`,
        ].join("\n"),
      }),
    });
  } catch (err) {
    console.error("[lead] alert email failed:", err);
  }
}

export async function submitLead(raw: unknown): Promise<LeadResult> {
  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    // Covers the honeypot too (website must be "") — keep the error generic.
    return { ok: false, error: "Please check the highlighted fields and try again." };
  }
  const input = parsed.data;

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return { ok: false, error: GENERIC_ERROR };

  // Time trap: humans don't complete a two-step form in under 2 seconds,
  // and a startedAt from the future or >24h old is not a live form.
  const elapsed = Date.now() - input.startedAt;
  if (elapsed < 2000 || elapsed > 24 * 3600_000) {
    return { ok: false, error: GENERIC_ERROR };
  }

  if (!(await verifyTurnstile(input.turnstileToken, ip))) {
    return { ok: false, error: GENERIC_ERROR };
  }

  // Attribution: copy geo from the visitor's analytics session when it exists.
  let country: string | undefined;
  let city: string | undefined;
  const sessionId = input.attribution?.sessionId;
  if (sessionId) {
    try {
      const snap = await adminDb().collection(col("sessions")).doc(sessionId).get();
      if (snap.exists) {
        country = (snap.data()?.country as string) || undefined;
        city = (snap.data()?.city as string) || undefined;
      }
    } catch {
      // Analytics session lookup is best-effort.
    }
  }

  const now = Date.now();
  const lead: Lead = {
    name: input.name,
    email: input.email,
    services: input.services,
    budget: input.budget,
    message: input.message,
    status: "new",
    notes: [],
    attribution: {
      visitorId: input.attribution?.visitorId,
      sessionId,
      path: input.attribution?.path,
      referrer: input.attribution?.referrer,
      utm: input.attribution?.utm,
      country,
      city,
    },
    createdAt: now,
    updatedAt: now,
  };

  try {
    const ref = await adminDb().collection(col("leads")).add(lead);
    // Mark the analytics session as converted (journey ⟷ lead link).
    if (sessionId) {
      adminDb()
        .collection(col("sessions"))
        .doc(sessionId)
        .set({ isLead: true, leadId: ref.id }, { merge: true })
        .catch(() => {});
    }
  } catch (err) {
    console.error("[lead] firestore write failed:", err);
    return { ok: false, error: GENERIC_ERROR };
  }

  bustTag("leads");
  await sendLeadAlert(lead);
  return { ok: true };
}
