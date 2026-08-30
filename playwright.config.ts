import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

/**
 * Gate B suite: runs against a local production build (`next start`) wired to
 * the REAL Firebase project but with FIRESTORE_COLLECTION_PREFIX=e2e_ so test
 * data never touches live content. Global setup seeds the e2e_ collections;
 * teardown deletes them.
 *
 * Run the suite ALONE: a second `next start` on the same .next directory
 * shares the incremental cache and repopulates entries the suite just
 * revalidated (observed as a settings-propagation flake).
 */
dotenv.config({ path: ".env.local" });
process.env.FIRESTORE_COLLECTION_PREFIX = "e2e_";

const PORT = 3111;

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global.setup.ts",
  globalTeardown: "./tests/e2e/global.teardown.ts",
  workers: 1, // shared Firestore state — deterministic order matters
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    ignoreHTTPSErrors: true,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      // Strip the sandbox egress proxy for the browser: localhost must be
      // direct; external Google auth calls are relayed via tests/helpers.
      env: Object.fromEntries(
        Object.entries(process.env).filter(
          ([k]) => !/^(https?_proxy|no_proxy|all_proxy)$/i.test(k),
        ),
      ) as Record<string, string>,
    },
  },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      ...process.env,
      FIRESTORE_COLLECTION_PREFIX: "e2e_",
      PORT: String(PORT),
    } as Record<string, string>,
  },
});
