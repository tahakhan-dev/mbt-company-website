import { describe, expect, it } from "vitest";
import { classifyTier } from "~/engine/capabilities";

const base = {
  webgl2: true,
  webgl1: true,
  reducedMotion: false,
  saveData: false,
  deviceMemoryGb: 8,
};

describe("classifyTier", () => {
  it("full capability → A", () => {
    expect(classifyTier(base)).toBe("A");
  });

  it("reduced motion always wins → C", () => {
    expect(classifyTier({ ...base, reducedMotion: true })).toBe("C");
  });

  it("save-data → C", () => {
    expect(classifyTier({ ...base, saveData: true })).toBe("C");
  });

  it("no WebGL at all → C", () => {
    expect(classifyTier({ ...base, webgl2: false, webgl1: false })).toBe("C");
  });

  it("WebGL1 only → B", () => {
    expect(classifyTier({ ...base, webgl2: false })).toBe("B");
  });

  it("low memory → B", () => {
    expect(classifyTier({ ...base, deviceMemoryGb: 2 })).toBe("B");
  });

  it("unknown memory stays A", () => {
    expect(classifyTier({ ...base, deviceMemoryGb: undefined })).toBe("A");
  });
});
