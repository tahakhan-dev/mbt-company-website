import { describe, expect, it } from "vitest";
import { isPubliclyVisible, projectSchema } from "~/lib/schemas/content";
import { bust, cacheSize, cached } from "~/lib/content/cache";
import { chapterProgress, pageProgress } from "~/engine/scroll";

const draftProject = projectSchema.parse({
  slug: "sample",
  name: "Sample",
  outcome: "An outcome",
  category: "Ops",
  status: "draft",
});

describe("publication integrity gate", () => {
  it("defaults are draft + unverified + not visible", () => {
    expect(draftProject.ownershipVerified).toBe(false);
    expect(draftProject.clientPermission).toBe(false);
    expect(isPubliclyVisible(draftProject)).toBe(false);
  });

  it("published status alone is NOT enough", () => {
    expect(isPubliclyVisible({ ...draftProject, status: "published" })).toBe(false);
    expect(
      isPubliclyVisible({ ...draftProject, status: "published", ownershipVerified: true }),
    ).toBe(false);
  });

  it("visible only with status + ownership + permission", () => {
    expect(
      isPubliclyVisible({
        ...draftProject,
        status: "published",
        ownershipVerified: true,
        clientPermission: true,
      }),
    ).toBe(true);
  });

  it("metrics require source and date", () => {
    expect(() =>
      projectSchema.parse({
        ...draftProject,
        metrics: [{ label: "MRR", value: "$1k" }],
      }),
    ).toThrow();
  });
});

describe("content cache", () => {
  it("caches within TTL and busts by prefix", async () => {
    bust();
    let loads = 0;
    const load = async () => {
      loads += 1;
      return loads;
    };
    expect(await cached("svc:list", load, 1000)).toBe(1);
    expect(await cached("svc:list", load, 1000)).toBe(1);
    bust("svc:");
    expect(await cached("svc:list", load, 1000)).toBe(2);
    expect(cacheSize()).toBeGreaterThan(0);
  });

  it("expires after TTL", async () => {
    bust();
    let loads = 0;
    const load = async () => {
      loads += 1;
      return loads;
    };
    expect(await cached("k", load, -1)).toBe(1);
    expect(await cached("k", load, -1)).toBe(2);
  });
});

describe("scroll math", () => {
  const range = { name: "ch", top: 1000, height: 500 };

  it("0 before entry, 1 after exit", () => {
    expect(chapterProgress(range, 0, 800)).toBe(0);
    expect(chapterProgress(range, 2000, 800)).toBe(1);
  });

  it("midpoint is between 0 and 1", () => {
    const p = chapterProgress(range, 850, 800);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });

  it("pageProgress clamps and divides", () => {
    expect(pageProgress(0, 3000, 800)).toBe(0);
    expect(pageProgress(2200, 3000, 800)).toBe(1);
    expect(pageProgress(1100, 3000, 800)).toBeCloseTo(0.5);
  });
});
