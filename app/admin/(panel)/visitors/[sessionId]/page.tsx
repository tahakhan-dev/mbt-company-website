import type { Metadata } from "next";
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { AdminCard } from "@/components/admin/ui";
import { VisitorJourney } from "@/components/admin/analytics/VisitorJourney";

export const metadata: Metadata = { title: "Visitor journey" };

export default async function VisitorSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const snap = await adminDb().collection(col("sessions")).doc(sessionId).get();
  const visitorId = (snap.data()?.visitorId as string | undefined) ?? undefined;
  const leadId = (snap.data()?.leadId as string | undefined) ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Visitor journey</h1>
        <div className="flex items-center gap-3 text-xs">
          {leadId && (
            <Link href={`/admin/leads?id=${leadId}`} className="text-cta hover:underline">
              Open linked lead →
            </Link>
          )}
          <Link href="/admin" className="text-aurora-teal hover:underline">
            ← Dashboard
          </Link>
        </div>
      </div>
      <AdminCard>
        <VisitorJourney sessionId={sessionId} visitorId={visitorId} />
      </AdminCard>
    </div>
  );
}
