import { describe, expect, it } from "vitest";
import loader from "@/lib/cloudinary/image-loader";

describe("cloudinary image loader", () => {
  it("injects f_auto,q_auto,w and c_limit for cloudinary URLs", () => {
    const out = loader({
      src: "https://res.cloudinary.com/demo/image/upload/v123/sample.jpg",
      width: 800,
      quality: undefined,
    });
    expect(out).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_limit/v123/sample.jpg",
    );
  });
  it("replaces an existing transformation segment", () => {
    const out = loader({
      src: "https://res.cloudinary.com/demo/image/upload/w_100,q_50/v123/sample.jpg",
      width: 640,
      quality: 70,
    });
    expect(out).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_70,w_640,c_limit/v123/sample.jpg",
    );
  });
  it("passes non-cloudinary sources through untouched", () => {
    expect(loader({ src: "/images/local.png", width: 640, quality: undefined })).toBe(
      "/images/local.png",
    );
    expect(loader({ src: "data:image/svg+xml,abc", width: 100, quality: undefined })).toBe(
      "data:image/svg+xml,abc",
    );
  });
});
