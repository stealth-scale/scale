import { describe, expect, it } from "vitest";

import { COVERAGE, SCORECARD, SKILLS, SWAPPED, TEAMS } from "#radar-chart/examples/scores.ts";

/**
 * Lists the teams of `TEAMS` in the order the examples render them.
 */
const NAMES = ["payments", "search", "identity"] as const;

/**
 * Returns the team with the highest score on a dimension.
 */
function leaderOf(dimension: string): string | undefined {
  const row = TEAMS.find((each) => each.dimension === dimension);

  return NAMES.toSorted((first, second) => (row?.[second] ?? 0) - (row?.[first] ?? 0))[0];
}

describe("scores", () => {
  it("lowers the scorecard's cost alone from last quarter", () => {
    expect(
      SCORECARD.filter((row) => row.current < row.previous).map((row) => row.dimension),
    ).toStrictEqual(["cost"]);
  });

  it("lists the scorecard's rows with throughput and cost swapped", () => {
    expect(SWAPPED.map((row) => row.dimension)).toStrictEqual([
      "latency",
      "cost",
      "throughput",
      "reliability",
      "coverage",
    ]);
  });

  it("keeps each dimension's scores when swapped", () => {
    expect(
      SWAPPED.toSorted((first, second) => first.dimension.localeCompare(second.dimension)),
    ).toStrictEqual(
      SCORECARD.toSorted((first, second) => first.dimension.localeCompare(second.dimension)),
    );
  });

  it("scores every dimension out of 10", () => {
    expect(
      [
        ...SCORECARD.flatMap((row) => [row.current, row.previous]),
        ...SKILLS.map((row) => row.level),
      ].every((score) => score >= 0 && score <= 10),
    ).toBe(true);
  });

  it.each([
    { dimension: "reliability", leader: "identity" },
    { dimension: "coverage", leader: "identity" },
    { dimension: "latency", leader: "search" },
    { dimension: "throughput", leader: "payments" },
  ])("puts $leader first on $dimension", ({ dimension, leader }) => {
    expect(leaderOf(dimension)).toBe(leader);
  });

  it("rates the platform team strongest on backend", () => {
    expect(SKILLS.toSorted((first, second) => second.level - first.level)[0]?.skill).toBe(
      "backend",
    );
  });

  it("rates the platform team weakest on design", () => {
    expect(SKILLS.toSorted((first, second) => first.level - second.level)[0]?.skill).toBe("design");
  });

  it("covers the CLI alone under 60%", () => {
    expect(COVERAGE.filter((row) => row.covered < 60).map((row) => row.module)).toStrictEqual([
      "cli",
    ]);
  });
});
