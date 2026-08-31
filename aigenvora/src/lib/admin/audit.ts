import { adminDb, col } from "~/lib/firebase/server";

/** Append-only audit trail for material content changes (spec §20.1). */
export async function audit(
  actor: string,
  action: string,
  target: string,
  detail?: Record<string, unknown>,
): Promise<void> {
  try {
    await adminDb()
      .collection(col("adminAudit"))
      .add({ actor, action, target, detail: detail ?? {}, at: new Date().toISOString() });
  } catch (err) {
    // The audit trail must never block the mutation it describes.
    console.error("audit write failed", err instanceof Error ? err.message : "unknown");
  }
}
