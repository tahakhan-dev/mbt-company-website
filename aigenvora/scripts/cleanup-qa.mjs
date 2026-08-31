/** Remove QA/e2e artifacts from v3 collections. Run from aigenvora/:
 *  node --env-file=../.env.local scripts/cleanup-qa.mjs */
import { createRequire } from "node:module";
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

const QA_EMAILS = ["qa@aigenvora.com", "e2e@aigenvora.com", "bot@example.com", "b@b.com"];
let removed = 0;

const leads = await db.collection("v3_leads").get();
for (const doc of leads.docs) {
  if (QA_EMAILS.includes(doc.data().email)) {
    await doc.ref.delete();
    removed++;
  }
}
await db.collection("v3_projects").doc("qa-gate-test").delete();
console.log(`cleanup: removed ${removed} QA leads + qa-gate-test project`);
