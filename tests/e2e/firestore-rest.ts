import crypto from "node:crypto";

/**
 * Minimal Firestore REST client for test assertions. Playwright's module
 * linker cannot load firebase-admin's auth chain inside spec workers, so
 * tests verify server-written data over REST with a service-account token
 * minted via node:crypto only.
 */
let cachedToken: { token: string; exp: number } | null = null;

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now() / 1000 + 60) return cachedToken.token;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claims}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(privateKey);
  const jwt = `${unsigned}.${b64url(signature)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = (await res.json()) as { access_token: string };
  cachedToken = { token: json.access_token, exp: now + 3500 };
  return json.access_token;
}

type FsValue = Record<string, unknown>;

function decodeValue(v: FsValue): unknown {
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v)
    return (((v.arrayValue as FsValue).values as FsValue[]) ?? []).map(decodeValue);
  if ("mapValue" in v) return decodeFields(((v.mapValue as FsValue).fields ?? {}) as Record<string, FsValue>);
  return undefined;
}

function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

function base(): string {
  return `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
}

export async function fsGetDoc(path: string): Promise<Record<string, unknown> | null> {
  const token = await accessToken();
  const res = await fetch(`${base()}/${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404) return null;
  const json = (await res.json()) as { fields?: Record<string, FsValue> };
  return json.fields ? decodeFields(json.fields) : null;
}

/** Equality query on one field; returns decoded docs with their ids. */
export async function fsQuery(
  collection: string,
  field: string,
  value: string,
): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const token = await accessToken();
  const res = await fetch(`${base()}:runQuery`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: "EQUAL",
            value: { stringValue: value },
          },
        },
        limit: 20,
      },
    }),
  });
  const rows = (await res.json()) as { document?: { name: string; fields: Record<string, FsValue> } }[];
  return rows
    .filter((r) => r.document)
    .map((r) => ({
      id: r.document!.name.split("/").pop()!,
      data: decodeFields(r.document!.fields ?? {}),
    }));
}

export async function fsListSubcollection(
  parentPath: string,
  sub: string,
): Promise<Record<string, unknown>[]> {
  const token = await accessToken();
  const res = await fetch(`${base()}/${parentPath}/${sub}?pageSize=300`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await res.json()) as { documents?: { fields: Record<string, FsValue> }[] };
  return (json.documents ?? []).map((d) => decodeFields(d.fields ?? {}));
}

export async function fsDeleteDoc(path: string): Promise<void> {
  const token = await accessToken();
  await fetch(`${base()}/${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
