import { describe, expect, it } from "vitest";

import { lineOf, report } from "#resolve/problem.ts";

describe("report", () => {
  it("collects problems in the order they are recorded", () => {
    const faults = report();

    faults.problem("time-off.routes.request.sample", "is required on a path with parameters");
    faults.problem("product.version", "is empty");

    expect(faults.problems).toStrictEqual([
      { path: "time-off.routes.request.sample", reason: "is required on a path with parameters" },
      { path: "product.version", reason: "is empty" },
    ]);
  });

  it("keeps warnings apart from problems", () => {
    const faults = report();

    faults.warning(
      "time-off.featureFlags.calendar.expires",
      "is 2026-01-01, and the flag is past it",
    );

    expect([faults.problems, faults.warnings.length]).toStrictEqual([[], 1]);
  });

  it("writes a fault as its path and its reason", () => {
    expect(lineOf({ path: "product.version", reason: "is empty" })).toBe(
      "product.version: is empty",
    );
  });
});
