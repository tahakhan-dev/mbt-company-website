// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import { config as loadEnv } from "dotenv";

// Dev/build convenience: share the repo root .env.local (Netlify injects real env in prod).
loadEnv({ path: "../.env.local" });

// The Netlify adapter's local dev spins up a Deno edge-functions server that
// isn't present on this machine; the adapter only matters for `astro build`.
const isDevServer = process.argv.includes("dev");

export default defineConfig({
  site: "https://aigenvora.com",
  output: "server",
  adapter: isDevServer ? undefined : netlify(),
  devToolbar: { enabled: false },
  vite: {
    // three r158 + postprocessing are the only heavy client deps; keep them out of the shared chunk.
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three") || id.includes("node_modules/postprocessing")) {
              return "engine-vendor";
            }
          },
        },
      },
    },
  },
});
