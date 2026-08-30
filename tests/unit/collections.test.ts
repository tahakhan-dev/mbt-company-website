import { afterEach, describe, expect, it, vi } from "vitest";
import { col, cacheTag } from "@/lib/firebase/collections";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("col()", () => {
  it("returns the bare name without a prefix", () => {
    vi.stubEnv("FIRESTORE_COLLECTION_PREFIX", "");
    expect(col("services")).toBe("services");
  });
  it("applies the env prefix (test isolation)", () => {
    vi.stubEnv("FIRESTORE_COLLECTION_PREFIX", "e2e_");
    expect(col("services")).toBe("e2e_services");
    expect(col("settings")).toBe("e2e_settings");
  });
});

describe("cacheTag()", () => {
  it("includes the prefix so test and prod caches never collide", () => {
    vi.stubEnv("FIRESTORE_COLLECTION_PREFIX", "e2e_");
    expect(cacheTag("projects")).toBe("e2e_projects");
    vi.stubEnv("FIRESTORE_COLLECTION_PREFIX", "");
    expect(cacheTag("projects")).toBe("projects");
  });
});
