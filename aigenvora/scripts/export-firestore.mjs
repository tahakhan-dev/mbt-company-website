/**
 * Full Firestore backup to ../secrets/backups/<ISO date>/ (gitignored).
 * Usage (from aigenvora/): node --env-file=../.env.local scripts/export-firestore.mjs
 * Read-only against Firestore; subcollections one level deep included.
 */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore();

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = join(process.cwd(), "..", "secrets", "backups", stamp);
await mkdir(outDir, { recursive: true });

const collections = await db.listCollections();
let totalDocs = 0;

for (const colRef of collections) {
  const snap = await colRef.get();
  const docs = {};
  for (const doc of snap.docs) {
    docs[doc.id] = doc.data();
    const subcols = await doc.ref.listCollections();
    for (const sub of subcols) {
      const subSnap = await sub.get();
      docs[doc.id][`__sub__${sub.id}`] = Object.fromEntries(
        subSnap.docs.map((d) => [d.id, d.data()]),
      );
      totalDocs += subSnap.size;
    }
  }
  await writeFile(join(outDir, `${colRef.id}.json`), JSON.stringify(docs, null, 2));
  totalDocs += snap.size;
  console.log(`${colRef.id}: ${snap.size} docs`);
}

console.log(`\nBackup complete: ${collections.length} collections, ${totalDocs} docs → ${outDir}`);
