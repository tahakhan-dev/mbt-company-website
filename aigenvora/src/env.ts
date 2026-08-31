import { z } from "zod";

/**
 * Server-side environment contract, validated once at module load.
 * Firebase fields are optional until Phase 6 wires the CMS reads everywhere;
 * requireFirebaseEnv() hard-fails at the call sites that actually need them,
 * so a missing secret can never half-configure the Admin SDK.
 */
const envSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  FIREBASE_CLIENT_EMAIL: z.email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
  FIRESTORE_COLLECTION_PREFIX: z.string().optional(),
  PUBLIC_SITE_URL: z.url().default("https://aigenvora.com"),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(
    `Invalid environment: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
  );
}

export const env: Env = parsed.data;

export function requireFirebaseEnv(): Required<
  Pick<Env, "FIREBASE_PROJECT_ID" | "FIREBASE_CLIENT_EMAIL" | "FIREBASE_PRIVATE_KEY">
> {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase Admin credentials are not configured (FIREBASE_* env vars).");
  }
  return { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY };
}
