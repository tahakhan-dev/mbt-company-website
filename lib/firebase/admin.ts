import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

/**
 * Firebase Admin singleton. ALL Firestore/Auth access in the app flows
 * through this module (server actions, route handlers, Netlify functions,
 * scripts). The client SDK is used only on /admin/login to obtain an ID
 * token. Firestore rules deny everything — the Admin SDK bypasses them.
 */
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Copy .env.example to .env.local and fill in the Firebase service-account values.`,
    );
  }
  return value;
}

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0 && existing[0]) return existing[0];

  const app = initializeApp({
    credential: cert({
      projectId: requiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
      // .env files store the key with literal \n sequences.
      privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
  try {
    // REST transport: faster cold starts in serverless functions than gRPC.
    initializeFirestore(app, { preferRest: true });
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
