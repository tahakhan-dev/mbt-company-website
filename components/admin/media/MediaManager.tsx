"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadSimple, Copy } from "@phosphor-icons/react/dist/ssr";
import { AdminButton, AdminCard, EmptyState } from "@/components/admin/ui";
import { formatNumber } from "@/lib/utils/format";

type Asset = { url: string; publicId: string; bytes: number; createdAt: string };

/** Downscale to ≤1920px + WebP before upload — keeps Cloudinary credits low. */
async function compress(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.type === "image/webp") return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

export function MediaManager({ configured }: { configured: boolean }) {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!configured) return;
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((json) => setAssets(json.ok ? json.assets : []))
      .catch(() => setAssets([]));
  }, [configured]);

  if (!configured) {
    return (
      <AdminCard title="Cloudinary not configured">
        <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
          <p>
            Media uploads need your Cloudinary <strong className="text-ink">cloud name</strong>
            (the API key and secret are already set). Two minutes:
          </p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Log in at cloudinary.com → Dashboard — the cloud name is at the top.</li>
            <li>
              Set <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs">CLOUDINARY_CLOUD_NAME</code>{" "}
              and <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>{" "}
              in <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs">.env.local</code> and in Netlify env vars.
            </li>
            <li>Redeploy (env changes need one). Uploads then work here with zero code changes.</li>
          </ol>
          <p>
            Until then the site uses its generated aurora cover art everywhere, so nothing looks
            broken.
          </p>
        </div>
      </AdminCard>
    );
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const blob = await compress(file);
      const form = new FormData();
      form.set("file", new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: blob.type }));
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const json = await res.json();
      if (json.ok) {
        toast.success("Uploaded — URL copied to clipboard");
        await navigator.clipboard.writeText(json.url).catch(() => {});
        setAssets((prev) => [
          { url: json.url, publicId: json.publicId, bytes: blob.size, createdAt: new Date().toISOString() },
          ...(prev ?? []),
        ]);
      } else toast.error(json.error ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cta px-4 py-2 text-sm font-medium text-void hover:bg-cta-bright">
        <UploadSimple className="size-4" aria-hidden="true" />
        {busy ? "Uploading…" : "Upload image"}
        <input type="file" accept="image/*" className="sr-only" onChange={onPick} disabled={busy} />
      </label>
      <p className="text-xs text-ink-faint">
        Images are downscaled to ≤1920px WebP in your browser before upload, then served with
        f_auto,q_auto — free-tier friendly at every step.
      </p>

      {assets === null ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-white/[0.05]" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState title="No uploads yet" detail="Uploaded images appear here with copy-URL buttons." />
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {assets.map((asset) => (
            <li key={asset.publicId} className="group relative overflow-hidden rounded-xl ring-1 ring-white/10">
              <div className="relative aspect-square">
                <Image src={asset.url} alt={asset.publicId} fill sizes="200px" className="object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-void/80 px-2.5 py-2 text-[0.65rem] backdrop-blur-sm">
                <span className="truncate text-ink-faint">{formatNumber(asset.bytes)} B</span>
                <AdminButton
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(asset.url);
                    toast.success("URL copied");
                  }}
                >
                  <Copy className="size-3.5" aria-hidden="true" /> Copy URL
                </AdminButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
