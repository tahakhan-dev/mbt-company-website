/**
 * One-time (idempotent) Firebase project setup:
 *   1. Enables the Email/Password sign-in provider.
 *   2. Ensures a Web App registration exists (prints its config).
 *   3. Deploys firestore.rules (deny-all) via the Rules REST API.
 *   4. Verifies the whole auth path with a throwaway sign-in round trip.
 *
 * Run: npm run setup:firebase
 */
import { readFileSync } from "node:fs";
import { cert } from "firebase-admin/app";

const projectId = requireEnv("FIREBASE_PROJECT_ID");
const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
const privateKey = requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
const webApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✖ Missing required env var ${name} (see .env.example)`);
    process.exit(1);
  }
  return v;
}

const cred = cert({ projectId, clientEmail, privateKey });
const { access_token: token } = await cred.getAccessToken();

async function api<T = unknown>(
  label: string,
  url: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; json: T }> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let json: T;
  try {
    json = JSON.parse(text) as T;
  } catch {
    json = {} as T;
  }
  if (!res.ok) console.error(`✖ ${label}: HTTP ${res.status} ${text.slice(0, 300)}`);
  return { ok: res.ok, status: res.status, json };
}

// ---------------------------------------------------------------------------
// 1. Email/Password provider
// ---------------------------------------------------------------------------
const cfg = await api<{ signIn?: { email?: { enabled?: boolean } } }>(
  "read auth config",
  `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`,
);
if (cfg.json.signIn?.email?.enabled) {
  console.log("✔ Email/Password sign-in already enabled");
} else {
  const upd = await api(
    "enable Email/Password sign-in",
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config?updateMask=signIn.email`,
    {
      method: "PATCH",
      body: JSON.stringify({ signIn: { email: { enabled: true, passwordRequired: true } } }),
    },
  );
  if (!upd.ok) process.exit(1);
  console.log("✔ Email/Password sign-in enabled");
}

// ---------------------------------------------------------------------------
// 2. Web app registration
// ---------------------------------------------------------------------------
type WebAppList = { apps?: { name: string; appId: string; displayName?: string }[] };
const list = await api<WebAppList>(
  "list web apps",
  `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`,
);
let appName = list.json.apps?.[0]?.name;
if (!appName) {
  const create = await api<{ name: string }>(
    "create web app",
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`,
    { method: "POST", body: JSON.stringify({ displayName: "MBT Website" }) },
  );
  if (!create.ok) process.exit(1);
  // Poll the long-running operation until the app exists.
  for (let i = 0; i < 20 && !appName; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await api<{ done?: boolean; response?: { name?: string } }>(
      "poll web app operation",
      `https://firebase.googleapis.com/v1/${create.json.name}`,
    );
    if (poll.json.done) appName = poll.json.response?.name;
  }
  if (!appName) {
    console.error("✖ Web app creation did not complete");
    process.exit(1);
  }
}
const config = await api<Record<string, string>>(
  "read web app config",
  `https://firebase.googleapis.com/v1beta1/${appName}/config`,
);
console.log("✔ Web app config:");
for (const k of ["apiKey", "authDomain", "projectId", "appId"]) {
  console.log(`    ${k} = ${config.json[k]}`);
}
if (webApiKey && config.json.apiKey !== webApiKey) {
  console.warn("⚠ NEXT_PUBLIC_FIREBASE_API_KEY in .env.local differs from the project's web API key above — update it.");
}

// ---------------------------------------------------------------------------
// 3. Firestore rules (deny all client access)
// ---------------------------------------------------------------------------
const rulesSource = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const ruleset = await api<{ name: string }>(
  "create ruleset",
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
  {
    method: "POST",
    body: JSON.stringify({
      source: { files: [{ name: "firestore.rules", content: rulesSource }] },
    }),
  },
);
if (!ruleset.ok) process.exit(1);
const releaseName = `projects/${projectId}/releases/cloud.firestore`;
const patch = await api(
  "update rules release",
  `https://firebaserules.googleapis.com/v1/${releaseName}?updateMask=rulesetName`,
  {
    method: "PATCH",
    body: JSON.stringify({ release: { name: releaseName, rulesetName: ruleset.json.name } }),
  },
);
if (!patch.ok) {
  // First-ever release must be created rather than patched.
  const created = await api(
    "create rules release",
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
    { method: "POST", body: JSON.stringify({ name: releaseName, rulesetName: ruleset.json.name }) },
  );
  if (!created.ok) process.exit(1);
}
console.log(`✔ Firestore rules deployed (ruleset ${ruleset.json.name.split("/").pop()})`);

// ---------------------------------------------------------------------------
// 4. Live verification: sign-in round trip with a throwaway user
// ---------------------------------------------------------------------------
if (!webApiKey) {
  console.warn("⚠ NEXT_PUBLIC_FIREBASE_API_KEY not set — skipping sign-in round-trip check");
} else {
  const probeEmail = `setup-probe-${Date.now()}@example.com`;
  const probePassword = `Probe-${Math.random().toString(36).slice(2)}-9x!`;
  const created = await api<{ localId: string }>(
    "create probe user",
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts`,
    { method: "POST", body: JSON.stringify({ email: probeEmail, password: probePassword, emailVerified: true }) },
  );
  const signIn = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${webApiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: probeEmail, password: probePassword, returnSecureToken: true }),
    },
  );
  const signInBody = (await signIn.json()) as { idToken?: string; error?: { message?: string } };
  if (created.json.localId) {
    await api(
      "delete probe user",
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:delete`,
      { method: "POST", body: JSON.stringify({ localId: created.json.localId }) },
    );
  }
  if (signIn.ok && signInBody.idToken) {
    console.log("✔ Email/Password sign-in round trip verified (probe user cleaned up)");
  } else {
    console.error(`✖ Sign-in round trip failed: ${signInBody.error?.message ?? signIn.status}`);
    process.exit(1);
  }
}

console.log("\nFirebase setup complete.");
