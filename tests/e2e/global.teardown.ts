import { execFileSync } from "node:child_process";

/** Delete every e2e_* collection after the suite. */
export default function globalTeardown() {
  execFileSync(
    "node",
    ["--env-file=.env.local", "--import", "tsx", "scripts/cleanup-e2e.mts"],
    {
      stdio: "inherit",
      env: { ...process.env, FIRESTORE_COLLECTION_PREFIX: "e2e_" },
    },
  );
}
