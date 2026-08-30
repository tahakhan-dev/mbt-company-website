import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { sessionDocSchema, type TrackerEvent } from "@/lib/schemas/analytics";
import { formatDateTime, formatDuration } from "@/lib/utils/format";
import { Badge } from "@/components/admin/ui";

const EVENT_LABEL: Record<string, string> = {
  page_view: "Viewed",
  scroll_depth: "Scrolled",
  cta_click: "Clicked CTA",
  form_start: "Started form",
  form_submit: "Submitted form",
  outbound_click: "Outbound click",
};

/**
 * Timeline of one visitor session (every page + event with timestamps).
 * Server component — embedded in the Lead drawer and the analytics
 * dashboard's session explorer.
 */
export async function VisitorJourney({
  sessionId,
  visitorId,
}: {
  sessionId?: string;
  visitorId?: string;
}) {
  if (!sessionId) {
    return (
      <p className="text-sm text-ink-faint">
        No journey attached — the visitor had tracking disabled (DNT/GPC) or the session
        expired before submission.
      </p>
    );
  }

  const ref = adminDb().collection(col("sessions")).doc(sessionId);
  const [snap, eventsSnap, visitorSnap] = await Promise.all([
    ref.get(),
    ref.collection("events").orderBy("ts", "asc").limit(200).get(),
    visitorId ? adminDb().collection(col("visitors")).doc(visitorId).get() : Promise.resolve(null),
  ]);

  if (!snap.exists) {
    return <p className="text-sm text-ink-faint">Session {sessionId.slice(0, 8)}… no longer exists (raw data is purged after 90 days).</p>;
  }
  const parsed = sessionDocSchema.safeParse(snap.data());
  if (!parsed.success) return <p className="text-sm text-ink-faint">Session data unreadable.</p>;
  const session = parsed.data;
  const events = eventsSnap.docs
    .map((d) => d.data() as TrackerEvent)
    .filter((e) => typeof e.ts === "number");
  const sessionCount = (visitorSnap?.data()?.sessionCount as number | undefined) ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge tone="teal">{session.device}</Badge>
        {session.country && <Badge>{[session.city, session.country].filter(Boolean).join(", ")}</Badge>}
        <Badge>{formatDuration(session.durationSec)} on site</Badge>
        <Badge>{session.pageCount} pages</Badge>
        <Badge>max scroll {session.maxScroll}%</Badge>
        {sessionCount > 1 && <Badge tone="violet">visit #{sessionCount}</Badge>}
        {session.asnOrg && session.asnType !== "isp" && <Badge tone="amber">{session.asnOrg}</Badge>}
      </div>
      <p className="text-xs text-ink-faint">
        Arrived {formatDateTime(session.startedAt)} ·{" "}
        {session.utm.source
          ? `utm: ${session.utm.source}${session.utm.campaign ? ` / ${session.utm.campaign}` : ""}`
          : session.referrer
            ? `from ${(() => { try { return new URL(session.referrer).hostname; } catch { return session.referrer; } })()}`
            : "direct"}
      </p>

      <ol className="relative space-y-0 border-l border-white/10 pl-4">
        {events.map((event, i) => (
          <li key={i} className="relative pb-3 last:pb-0">
            <span
              className="absolute -left-[21.5px] top-1.5 size-2 rounded-full bg-aurora-teal/70 ring-2 ring-void"
              aria-hidden="true"
            />
            <p className="text-sm">
              <span className="text-ink-muted">{EVENT_LABEL[event.t] ?? event.t}</span>{" "}
              <span className="font-mono text-xs text-ink">
                {event.t === "scroll_depth"
                  ? `${event.meta?.depth ?? "?"}% of ${event.path}`
                  : event.t === "cta_click"
                    ? `${String(event.meta?.cta ?? "")} on ${event.path}`
                    : event.t === "outbound_click"
                      ? String(event.meta?.href ?? event.path)
                      : event.path}
              </span>
            </p>
            <p className="text-[0.65rem] text-ink-faint">{formatDateTime(event.ts)}</p>
          </li>
        ))}
        {events.length === 0 && (
          <li className="text-sm text-ink-faint">No granular events stored for this session.</li>
        )}
      </ol>
    </div>
  );
}
