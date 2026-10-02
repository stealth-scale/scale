import { describe, expect, it } from "vitest";

import { LEDGER } from "#checks.fixtures.ts";
import { checking, faultsAt, reportsOf, validateEmpty } from "#resolution.ts";

const FAULTS = [
  { path: "ledger.requires.1", reason: "needs tags ^9.0.0" },
  { path: "ledger.requires.10", reason: "needs audit" },
  { path: "ledger.requires", reason: "forms a cycle" },
];

describe("resolution", () => {
  it("returns the faults the build reports on the standalone product", () => {
    expect(reportsOf(LEDGER).problems.map(({ path }) => path)).toStrictEqual(["ledger.requires.1"]);
  });

  it("returns the faults at a path or under it", () => {
    expect(faultsAt(FAULTS, "ledger.requires.1")).toStrictEqual([
      "ledger.requires.1 needs tags ^9.0.0",
    ]);
  });

  it("throws listing every fault", () => {
    expect(() => {
      validateEmpty(["one", "two"]);
    }).toThrow("one\ntwo");
  });

  it("throws nothing where no fault is listed", () => {
    expect(() => {
      validateEmpty([]);
    }).not.toThrow();
  });

  it("rejects where the work throws", async () => {
    await expect(
      checking(() => {
        throw new Error("faulty");
      }),
    ).rejects.toThrow("faulty");
  });
});
