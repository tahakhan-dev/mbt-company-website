import { describe, expect, it } from "vitest";
import {
  heartbeatFlushDelay,
  writesForBatch,
  budgetMode,
  DAILY_WRITE_SOFT_LIMIT,
} from "@/lib/analytics/budget";

describe("heartbeatFlushDelay — decays so long idle reads stay cheap", () => {
  it("starts at 15s, decays to 30s after 60s, 60s after 180s on one page", () => {
    expect(heartbeatFlushDelay(0)).toBe(15_000);
    expect(heartbeatFlushDelay(45)).toBe(15_000);
    expect(heartbeatFlushDelay(60)).toBe(30_000);
    expect(heartbeatFlushDelay(179)).toBe(30_000);
    expect(heartbeatFlushDelay(180)).toBe(60_000);
    expect(heartbeatFlushDelay(3600)).toBe(60_000);
  });
});

describe("writesForBatch — accounting used for the daily counter", () => {
  it("counts 1 session write + 1 per non-heartbeat event", () => {
    expect(
      writesForBatch({
        events: [{ t: "page_view" }, { t: "heartbeat" }, { t: "scroll_depth" }],
        isNewSession: false,
      }),
    ).toBe(3); // session update + page_view + scroll_depth
  });
  it("adds visitor upsert on new sessions", () => {
    expect(writesForBatch({ events: [{ t: "page_view" }], isNewSession: true })).toBe(3);
  });
  it("heartbeat-only flushes cost exactly one write", () => {
    expect(writesForBatch({ events: [{ t: "heartbeat" }], isNewSession: false })).toBe(1);
  });
});

describe("budgetMode — kill-switch", () => {
  it("is normal under the soft limit", () => {
    expect(budgetMode(0)).toBe("normal");
    expect(budgetMode(DAILY_WRITE_SOFT_LIMIT - 1)).toBe("normal");
  });
  it("samples (drops event docs) past the soft limit", () => {
    expect(budgetMode(DAILY_WRITE_SOFT_LIMIT)).toBe("sampling");
  });
  it("halts entirely at the hard limit (19k)", () => {
    expect(budgetMode(19_000)).toBe("halted");
  });
});
