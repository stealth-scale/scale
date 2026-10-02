import { describe, expect, it } from "vitest";

import { BUDGET_MAX, HOST, LATENCY, USE } from "#gauge-chart/examples/readings.ts";

describe("readings", () => {
  it("ends the latency's zones at the dial's end", () => {
    expect(LATENCY.at(-1)?.upTo).toBe(BUDGET_MAX);
  });

  it("puts the error budget at the end of the watch zone", () => {
    expect(LATENCY.find((zone) => zone.key === "watch")?.upTo).toBe(900);
  });

  it("ends the use's zones at the whole resource", () => {
    expect(USE.at(-1)?.upTo).toBe(1);
  });

  it("puts the host's disk alone in the full zone", () => {
    expect(
      HOST.filter((resource) => resource.used > 0.9).map((resource) => resource.key),
    ).toStrictEqual(["disk"]);
  });
});
