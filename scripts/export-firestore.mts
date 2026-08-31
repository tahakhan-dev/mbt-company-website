/**
 * Full Firestore backup to secrets/backups/<ISO date>/ (gitignored).
 * Usage: node --env-file=.env.local --import tsx scripts/export-firestore.mts
 * Read-only against Firestore; overwrites nothing outside the new backup dir.
 * Subcollections one level deep (e.g. sessions/{id}/events) are included.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { adminDb } from "../lib/firebase/admin";

const db = adminDb();
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = join(process.cwd(), "secrets", "backups", stamp);
await mkdir(outDir, { recursive: true });

const collections = await db.listCollections();
let totalDocs = 0;

for (const col of collections) {
  const snap = await col.get();
  const docs: Record<string, unknown> = {};
  for (const doc of snap.docs) {
    docs[doc.id] = doc.data();
    const subcols = await doc.ref.listCollections();
    for (const sub of subcols) {
      const subSnap = await sub.get();
      (docs[doc.id] as Record<string, unknown>)[`__sub__${sub.id}`] =
        Object.fromEntries(subSnap.docs.map((d) => [d.id, d.data()]));
      totalDocs += subSnap.size;
    }
  }
  await writeFile(join(outDir, `${col.id}.json`), JSON.stringify(docs, null, 2));
  totalDocs += snap.size;
  console.log(`${col.id}: ${snap.size} docs`);
}

console.log(`\nBackup complete: ${collections.length} collections, ${totalDocs} docs → ${outDir}`);
