import { describe, expect, it } from "vitest";

import {
  AUDITED,
  CALLS,
  LOGGED,
  MOVES,
  named,
  REGIONS,
  REQUEUED,
  SERVICES,
} from "#chord-diagram/examples/calls.ts";
import { marksOf } from "#chord-diagram/marks.ts";
import { flowBalance } from "#sankey-chart/flows.ts";

function balanceOf(
  keys: readonly string[],
  flows: Parameters<typeof flowBalance>[1],
  key: string,
): ReturnType<typeof flowBalance>[number] | undefined {
  return flowBalance(named(keys, String), flows).find((node) => node.key === key);
}

describe("calls", () => {
  it("makes api send 6100 calls and receive 3400", () => {
    const api = balanceOf(SERVICES, CALLS, "api");

    expect([api?.outflow, api?.inflow]).toStrictEqual([6100, 3400]);
  });

  it("makes api send the most calls", () => {
    expect(
      flowBalance(named(SERVICES, String), CALLS).toSorted(
        (first, second) => second.outflow - first.outflow,
      )[0]?.key,
    ).toBe("api");
  });

  it("calls both ways between every pair that calls", () => {
    expect(
      CALLS.every((call) => CALLS.some((back) => back.from === call.to && back.to === call.from)),
    ).toBe(true);
  });

  it("makes jobs call itself 2600 times", () => {
    expect(REQUEUED.find((flow) => flow.from === flow.to)).toStrictEqual({
      from: "jobs",
      to: "jobs",
      value: 2600,
    });
  });

  it("makes the audit log receive 2000 calls and send none", () => {
    const audit = balanceOf(AUDITED, LOGGED, "audit");

    expect([audit?.inflow, audit?.outflow]).toStrictEqual([2000, 0]);
  });

  it("puts the audit log's arc at place 14 of the walk", () => {
    const last = marksOf(named(AUDITED, String), LOGGED).at(-1);

    expect(last?.kind === "arc" ? [last.group.key, last.walk] : undefined).toStrictEqual([
      "audit",
      14,
    ]);
  });

  it("makes north gain 1030 people", () => {
    const north = balanceOf(REGIONS, MOVES, "north");

    expect((north?.inflow ?? 0) - (north?.outflow ?? 0)).toBe(1030);
  });

  it("moves people both ways between every pair of regions that moves", () => {
    expect(
      MOVES.every((move) => MOVES.some((back) => back.from === move.to && back.to === move.from)),
    ).toBe(true);
  });
});
