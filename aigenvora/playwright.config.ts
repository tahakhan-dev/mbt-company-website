import { defineConfig } from "@playwright/test";

/**
 * E2E against the dev server (start it first: npm run dev). The suite is
 * read-only except the lead-endpoint specs, which write clearly-labeled QA
 * documents to the isolated v3_leads collection.
 */
export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:4321",
    viewport: { width: 1440, height: 900 },
  },
});
