import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env, requireFirebaseEnv } from "~/env";

/**
 * Firebase Admin singleton — the ONLY Firestore/Auth entry point in the app
 * (Astro endpoints, server components, scripts). Client rules deny everything;
 * the Admin SDK bypasses them, so this module must never leak into a client
 * bundle. Astro enforces that via the server-only import boundary in pages,
 * and `astro build` is checked for it in CI (see tests/no-client-firebase.test.ts).
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0 && existing[0]) return existing[0];

  const creds = requireFirebaseEnv();
  const app = initializeApp({
    credential: cert({
      projectId: creds.FIREBASE_PROJECT_ID,
      clientEmail: creds.FIREBASE_CLIENT_EMAIL,
      // .env files store the key with literal \n sequences.
      privateKey: creds.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  try {
    // REST transport: faster cold starts in serverless functions than gRPC.
    const db = initializeFirestore(app, { preferRest: true });
    db.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Already initialized elsewhere in this runtime — fine.
  }
  return app;
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

/** Collection-name indirection — honors FIRESTORE_COLLECTION_PREFIX for test isolation. */
export function col(name: string): string {
  return `${env.FIRESTORE_COLLECTION_PREFIX ?? ""}${name}`;
}
