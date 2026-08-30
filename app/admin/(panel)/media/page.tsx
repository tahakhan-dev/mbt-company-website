import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/media/MediaManager";

export const metadata: Metadata = { title: "Media" };

export default function AdminMediaPage() {
  const configured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold">Media</h1>
      <MediaManager configured={configured} />
    </div>
  );
}
