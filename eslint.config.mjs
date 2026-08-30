import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    ".netlify/**",
    "out/**",
    "public/t.js",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Admin/marketing split shares one repo; underscore-prefixed args are intentional.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
