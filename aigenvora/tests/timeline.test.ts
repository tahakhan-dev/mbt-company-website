import { describe, expect, it } from "vitest";
import { cubicBezier, damp, easeMech, track, track3 } from "~/engine/timeline";

describe("cubicBezier", () => {
  it("hits the endpoints exactly", () => {
    const ease = cubicBezier(0.72, 0, 0.14, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
  });

  it("is monotonic for the brand easings", () => {
    let prev = 0;
    for (let i = 0; i <= 100; i++) {
      const v = easeMech(i / 100);
      expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = v;
    }
  });

  it("linear control points give identity", () => {
    const ease = cubicBezier(0.25, 0.25, 0.75, 0.75);
    expect(ease(0.3)).toBeCloseTo(0.3, 5);
    expect(ease(0.77)).toBeCloseTo(0.77, 5);
  });
});

describe("track", () => {
  it("clamps outside the key range", () => {
    const t = track([
      { t: 0.2, v: 10 },
      { t: 0.8, v: 20 },
    ]);
    expect(t(0)).toBe(10);
    expect(t(1)).toBe(20);
  });

  it("interpolates between keys", () => {
    const t = track([
      { t: 0, v: 0, ease: (x) => x },
      { t: 1, v: 100 },
    ]);
    expect(t(0.5)).toBeCloseTo(50, 5);
  });

  it("throws on an empty track", () => {
    expect(() => track([])).toThrow();
  });

  it("track3 interpolates each component", () => {
    const t = track3([
      { t: 0, v: [0, 10, 20], ease: (x) => x },
      { t: 1, v: [10, 20, 30] },
    ]);
    const out: [number, number, number] = [0, 0, 0];
    t(0.5, out);
    expect(out[0]).toBeCloseTo(5);
    expect(out[1]).toBeCloseTo(15);
    expect(out[2]).toBeCloseTo(25);
  });
});

describe("damp", () => {
  it("approaches the target without overshooting", () => {
    let v = 0;
    for (let i = 0; i < 200; i++) v = damp(v, 1, 9, 1 / 60);
    expect(v).toBeGreaterThan(0.99);
    expect(v).toBeLessThanOrEqual(1);
  });
});
