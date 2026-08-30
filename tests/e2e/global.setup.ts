import { execFileSync } from "node:child_process";

/** Seed the isolated e2e_ collections (idempotent) before the suite. */
export default function globalSetup() {
  execFileSync(
    "node",
    ["--env-file=.env.local", "--import", "tsx", "scripts/seed.mts"],
    {
      stdio: "inherit",
      env: { ...process.env, FIRESTORE_COLLECTION_PREFIX: "e2e_" },
    },
  );
}
