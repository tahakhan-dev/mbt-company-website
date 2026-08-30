import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { verifyAdmin } from "@/lib/admin/auth";

/**
 * Server-signed Cloudinary bridge (the API secret never reaches the client).
 * POST: upload one image (multipart "file") → { url, publicId, width, height }
 * GET:  list recent uploads
 * Fully env-gated: without CLOUDINARY_CLOUD_NAME both verbs return 501 and
 * the admin UI shows setup instructions instead.
 */
function cloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const env = cloudinaryEnv();
  if (!env) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary is not configured (set CLOUDINARY_CLOUD_NAME)." },
      { status: 501 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "File too large (max 10 MB)." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "mbt-site";
  const toSign = `folder=${folder}&timestamp=${timestamp}${env.apiSecret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const upload = new FormData();
  upload.set("file", file);
  upload.set("api_key", env.apiKey);
  upload.set("timestamp", String(timestamp));
  upload.set("folder", folder);
  upload.set("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${env.cloudName}/image/upload`, {
    method: "POST",
    body: upload,
  });
  const json = (await res.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  };
  if (!res.ok || !json.secure_url) {
    return NextResponse.json(
      { ok: false, error: json.error?.message ?? "Upload failed." },
      { status: 502 },
    );
  }
  return NextResponse.json({
    ok: true,
    url: json.secure_url,
    publicId: json.public_id,
    width: json.width,
    height: json.height,
  });
}

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const env = cloudinaryEnv();
  if (!env) return NextResponse.json({ ok: false, configured: false }, { status: 501 });

  const auth = Buffer.from(`${env.apiKey}:${env.apiSecret}`).toString("base64");
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.cloudName}/resources/image?prefix=mbt-site&type=upload&max_results=60`,
    { headers: { Authorization: `Basic ${auth}` } },
  );
  if (!res.ok) return NextResponse.json({ ok: false, error: "Listing failed." }, { status: 502 });
  const json = (await res.json()) as {
    resources?: { secure_url: string; public_id: string; bytes: number; created_at: string }[];
  };
  return NextResponse.json({
    ok: true,
    configured: true,
    assets: (json.resources ?? []).map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      bytes: r.bytes,
      createdAt: r.created_at,
    })),
  });
}
