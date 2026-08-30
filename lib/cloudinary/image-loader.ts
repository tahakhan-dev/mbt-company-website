"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Global next/image loader.
 *
 * Cloudinary-hosted sources get on-the-fly optimization
 * (`f_auto,q_auto,w_{width},c_limit`); everything else (generated SVG covers,
 * local assets, data URIs) passes through untouched, so the site never
 * depends on a specific media host being configured.
 */
const CLOUDINARY_UPLOAD_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const match = CLOUDINARY_UPLOAD_RE.exec(src);
  if (!match) return src;

  const [, base, rest] = match;
  // Strip any transformation segment already present so ours wins.
  const parts = (rest ?? "").split("/");
  const first = parts[0] ?? "";
  const alreadyTransformed = /(^|,)(w_|c_|f_|q_)/.test(first) && !first.startsWith("v");
  const publicPath = alreadyTransformed ? parts.slice(1).join("/") : rest;

  const q = quality ?? "auto";
  return `${base}f_auto,q_${q},w_${width},c_limit/${publicPath}`;
}
