/**
 * Deploys a static directory to Firebase Hosting via the REST API using the
 * service account (no firebase-tools, no card). Used for the live PREVIEW of
 * the public site at https://<site>.web.app — production still targets
 * Netlify (server features live there).
 *
 * Usage: node --env-file=.env.local --import tsx scripts/deploy-preview.mts <dir>
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { cert } from "firebase-admin/app";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: deploy-preview.mts <static-dir>");
  process.exit(1);
}
const siteId = process.env.FIREBASE_PROJECT_ID!;
const cred = cert({
  projectId: siteId,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
});
const { access_token: token } = await cred.getAccessToken();
const API = "https://firebasehosting.googleapis.com/v1beta1";

async function api<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status}: ${text.slice(0, 400)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

// Collect files → { "/path": { hash, gz } }
function walk(root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const full = path.join(root, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = new Map<string, { hash: string; gz: Buffer }>();
for (const full of walk(dir)) {
  const rel = "/" + path.relative(dir, full).split(path.sep).join("/");
  const gz = gzipSync(readFileSync(full), { level: 9 });
  files.set(rel, { hash: createHash("sha256").update(gz).digest("hex"), gz });
}
console.log(`prepared ${files.size} files`);

// 1) Create a version (cleanUrls so /about serves /about.html)
const version = await api<{ name: string }>("POST", `${API}/sites/${siteId}/versions`, {
  config: { cleanUrls: true, trailingSlashBehavior: "REMOVE" },
});
console.log("version:", version.name);

// 2) Declare files
const populate = await api<{ uploadRequiredHashes?: string[]; uploadUrl: string }>(
  "POST",
  `${API}/${version.name}:populateFiles`,
  { files: Object.fromEntries([...files.entries()].map(([p, f]) => [p, f.hash])) },
);
const required = new Set(populate.uploadRequiredHashes ?? []);
console.log(`uploading ${required.size}/${files.size} blobs`);

// 3) Upload required blobs (small parallelism)
const queue = [...files.values()].filter((f) => required.has(f.hash));
let uploaded = 0;
async function uploadWorker() {
  while (queue.length > 0) {
    const file = queue.pop()!;
    const res = await fetch(`${populate.uploadUrl}/${file.hash}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/octet-stream" },
      body: new Uint8Array(file.gz),
    });
    if (!res.ok) throw new Error(`upload ${file.hash.slice(0, 8)} -> ${res.status}`);
    uploaded++;
  }
}
await Promise.all(Array.from({ length: 6 }, uploadWorker));
console.log(`uploaded ${uploaded} blobs`);

// 4) Finalize + release
await api("PATCH", `${API}/${version.name}?updateMask=status`, { status: "FINALIZED" });
const release = await api<{ name: string }>(
  "POST",
  `${API}/sites/${siteId}/releases?versionName=${version.name}`,
);
console.log("released:", release.name);
console.log(`\n✔ LIVE: https://${siteId}.web.app`);
