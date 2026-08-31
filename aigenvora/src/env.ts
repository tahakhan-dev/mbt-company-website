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
  // v3_ default isolates the new app's data from the legacy site's collections
  // until Phase 7 migration flips it deliberately (docs/migration). The shared
  // .env.local sets this to "" for the legacy app — treat empty as unset here.
  FIRESTORE_COLLECTION_PREFIX: z
    .string()
    .optional()
    .transform((v) => (v ? v : "v3_")),
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
