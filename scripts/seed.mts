/**
 * Idempotent seed: one admin user (custom claim { admin: true }) + full site
 * content. Safe to re-run — content docs are upserted by stable IDs and the
 * admin user is created-or-updated. Honors FIRESTORE_COLLECTION_PREFIX so
 * the e2e suite can seed an isolated copy (e.g. e2e_services).
 *
 * Run: npm run seed
 */
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { col } from "@/lib/firebase/collections";
import { slugify } from "@/lib/utils/slug";
import {
  siteSettingsSchema,
  serviceSchema,
  projectSchema,
  teamMemberSchema,
  testimonialSchema,
  logoSchema,
} from "@/lib/schemas";
import { services, projects, team, testimonials, logos, settingsSeed } from "./seed-content";

const summary: { entity: string; action: string; id: string }[] = [];

function fail(msg: string): never {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. Admin user
// ---------------------------------------------------------------------------
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    fail("ADMIN_EMAIL / ADMIN_PASSWORD env vars are required (see .env.example). Aborting.");
  }
  if (password.length < 12) fail("ADMIN_PASSWORD must be at least 12 characters.");

  const auth = adminAuth();
  let uid: string;
  let action: string;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, { password, emailVerified: true });
    action = "updated";
  } catch {
    const created = await auth.createUser({ email, password, emailVerified: true });
    uid = created.uid;
    action = "created";
  }
  await auth.setCustomUserClaims(uid, { admin: true });
  summary.push({ entity: "auth admin", action: `${action} + claim {admin:true}`, id: email });
}

// ---------------------------------------------------------------------------
// 2. Content
// ---------------------------------------------------------------------------
async function upsert(
  collection: Parameters<typeof col>[0],
  id: string,
  data: Record<string, unknown>,
) {
  const ref = adminDb().collection(col(collection)).doc(id);
  const existing = await ref.get();
  const now = Date.now();
  await ref.set(
    {
      ...data,
      createdAt: existing.exists ? (existing.data()?.createdAt ?? now) : now,
      updatedAt: now,
    },
    { merge: false },
  );
  summary.push({
    entity: collection,
    action: existing.exists ? "updated" : "created",
    id,
  });
}

async function seedContent() {
  await upsert("settings", "site", siteSettingsSchema.parse(settingsSeed));
  for (const s of services) await upsert("services", s.slug, serviceSchema.parse(s));
  for (const p of projects) await upsert("projects", p.slug, projectSchema.parse(p));
  for (const m of team) await upsert("team", slugify(m.name), teamMemberSchema.parse(m));
  for (const [i, t] of testimonials.entries())
    await upsert("testimonials", `testimonial-${i + 1}`, testimonialSchema.parse(t));
  for (const l of logos) await upsert("logos", slugify(l.name), logoSchema.parse(l));
}

// ---------------------------------------------------------------------------
const prefix = process.env.FIRESTORE_COLLECTION_PREFIX ?? "";
console.log(
  `Seeding project ${process.env.FIREBASE_PROJECT_ID}${prefix ? ` (collection prefix "${prefix}")` : ""}…\n`,
);
await seedAdmin();
await seedContent();

const width = Math.max(...summary.map((r) => r.id.length));
console.log(`\n${"entity".padEnd(14)} ${"id".padEnd(width)}  action`);
console.log("-".repeat(14 + width + 10));
for (const row of summary) {
  console.log(`${row.entity.padEnd(14)} ${row.id.padEnd(width)}  ${row.action}`);
}
console.log(`\n✔ Seed complete: ${summary.length} records upserted.`);
