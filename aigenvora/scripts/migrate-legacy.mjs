/**
 * Legacy (unprefixed) → v3_ migration. Idempotent merges keyed by stable ids;
 * never deletes or edits legacy collections. EVERY migrated project lands as
 * draft with ownershipVerified:false + clientPermission:false — publication
 * happens only through the admin's verification gate.
 *
 * Usage (from aigenvora/):
 *   node --env-file=../.env.local scripts/migrate-legacy.mjs --dry-run
 *   node --env-file=../.env.local scripts/migrate-legacy.mjs
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const dryRun = process.argv.includes("--dry-run");

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore();
const now = new Date().toISOString();
const report = [];

async function migrateProjects() {
  const snap = await db.collection("projects").get();
  for (const doc of snap.docs) {
    const x = doc.data();
    const slug = x.slug ?? doc.id;
    const mapped = {
      slug,
      name: x.title ?? x.name ?? slug,
      outcome: x.summary ?? x.tagline ?? x.description ?? "",
      category: x.category ?? "Software",
      officialUrl: x.url ?? x.link ?? "",
      status: "draft",
      ownershipVerified: false,
      clientPermission: false,
      role: "",
      engagementModel: "",
      migratedFrom: `projects/${doc.id}`,
      migratedAt: now,
      updatedAt: now,
    };
    report.push(`project ${slug}: draft (unverified)`);
    if (!dryRun) await db.collection("v3_projects").doc(slug).set(mapped, { merge: true });
  }
  return snap.size;
}

async function migrateSimple(from, to, mapper) {
  const snap = await db.collection(from).get();
  for (const doc of snap.docs) {
    const mapped = mapper(doc.data(), doc.id);
    report.push(`${to}/${doc.id}`);
    if (!dryRun) await db.collection(to).doc(doc.id).set({ ...mapped, migratedFrom: `${from}/${doc.id}`, migratedAt: now }, { merge: true });
  }
  return snap.size;
}

const projects = await migrateProjects();
const team = await migrateSimple("team", "v3_team", (x) => ({ ...x, status: "draft" }));
const testimonials = await migrateSimple("testimonials", "v3_testimonials", (x) => ({
  ...x,
  status: "draft",
  textPermission: false,
  videoPermission: false,
}));

console.log(`${dryRun ? "[DRY RUN] " : ""}migrated: ${projects} projects, ${team} team, ${testimonials} testimonials — all as drafts`);
for (const line of report) console.log("  " + line);
