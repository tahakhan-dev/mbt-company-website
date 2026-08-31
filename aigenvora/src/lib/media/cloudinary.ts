import { createHash } from "node:crypto";

/**
 * Minimal signed Cloudinary upload (server-side, REST — no SDK). Env-gated:
 * everything no-ops with a clear reason until CLOUDINARY_CLOUD_NAME exists
 * (the owner's .env currently has key+secret but no cloud name).
 */

export function cloudinaryConfigured(): { ok: boolean; reason?: string } {
  if (!process.env["CLOUDINARY_CLOUD_NAME"]) {
    return { ok: false, reason: "CLOUDINARY_CLOUD_NAME is empty in the environment." };
  }
  if (!process.env["CLOUDINARY_API_KEY"] || !process.env["CLOUDINARY_API_SECRET"]) {
    return { ok: false, reason: "Cloudinary API key/secret missing." };
  }
  return { ok: true };
}

export async function uploadImage(
  file: File,
  folder = "aigenvora",
): Promise<{ ok: true; url: string; publicId: string } | { ok: false; error: string }> {
  const configured = cloudinaryConfigured();
  if (!configured.ok) return { ok: false, error: configured.reason! };

  const cloud = process.env["CLOUDINARY_CLOUD_NAME"]!;
  const apiKey = process.env["CLOUDINARY_API_KEY"]!;
  const secret = process.env["CLOUDINARY_API_SECRET"]!;
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}${secret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", apiKey);
  body.set("timestamp", String(timestamp));
  body.set("folder", folder);
  body.set("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) {
    return { ok: false, error: `Cloudinary responded ${res.status}` };
  }
  const data = (await res.json()) as { secure_url?: string; public_id?: string };
  if (!data.secure_url || !data.public_id) return { ok: false, error: "Malformed Cloudinary response" };
  return { ok: true, url: data.secure_url, publicId: data.public_id };
}
