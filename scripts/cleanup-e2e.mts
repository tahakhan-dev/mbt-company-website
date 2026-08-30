/**
 * Deletes every document in the e2e_-prefixed collections (including event
 * subcollections). Never touches unprefixed live data — the prefix is
 * hardcoded here on purpose.
 */
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

const PREFIX = "e2e_";
const db = adminDb();
let deleted = 0;

for (const name of COLLECTIONS) {
  const collection = `${PREFIX}${name}`;
  const snap = await db.collection(collection).get();
  for (const doc of snap.docs) {
    if (name === "sessions") {
      const events = await doc.ref.collection("events").get();
      for (const ev of events.docs) {
        await ev.ref.delete();
        deleted++;
      }
    }
    await doc.ref.delete();
    deleted++;
  }
  if (snap.size > 0) console.log(`cleaned ${collection}: ${snap.size} docs`);
}
console.log(`✔ e2e cleanup complete (${deleted} deletes)`);
