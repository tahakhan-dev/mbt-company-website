/**
 * Shared client-side identity keys. Written by the tracker (public/t.js) and
 * read by the lead form for attribution. No cookies, no PII, no fingerprint:
 * a random visitor UUID (localStorage, 13-month cap) and a session UUID
 * (sessionStorage, 30-min idle rotation).
 */
export const VISITOR_KEY = "mbt_vid";
export const VISITOR_TS_KEY = "mbt_vid_t";
export const SESSION_KEY = "mbt_sid";
export const SESSION_TS_KEY = "mbt_sid_t";
export const FIRST_TOUCH_KEY = "mbt_touch"; // {referrer, utm} JSON, session-scoped
export const DISABLE_KEY = "disable_tracking";

export type FirstTouch = { referrer?: string; utm?: Record<string, string> };

export function readAttribution(): {
  visitorId?: string;
  sessionId?: string;
  referrer?: string;
  utm?: Record<string, string>;
} {
  try {
    const visitorId = window.localStorage.getItem(VISITOR_KEY) ?? undefined;
    const sessionId = window.sessionStorage.getItem(SESSION_KEY) ?? undefined;
    const touchRaw = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
    const touch: FirstTouch = touchRaw ? JSON.parse(touchRaw) : {};
    return { visitorId, sessionId, referrer: touch.referrer, utm: touch.utm };
  } catch {
    return {};
  }
}
