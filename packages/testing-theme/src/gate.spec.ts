import { describe, expect, it } from "vitest";

import { gated } from "#gate.ts";

const RUNNERS = [
  ["one", (): readonly string[] => ["first thing"]],
  ["two", (): readonly string[] => []],
  ["three", (): readonly string[] => ["second thing", "third thing"]],
] as const;

describe("gated", () => {
  it("prefixes every violation with the name of the check that reported it", () => {
    expect(gated(RUNNERS, {})).toStrictEqual([
      "one: first thing",
      "three: second thing",
      "three: third thing",
    ]);
  });

  it("runs no check the skip option names", () => {
    expect(gated(RUNNERS, { skip: { three: "measured in the browser instead" } })).toStrictEqual([
      "one: first thing",
    ]);
  });

  it("reports a skip with a blank reason before the violations", () => {
    expect(gated(RUNNERS, { skip: { one: "  " } })).toStrictEqual([
      "skip of one gives no reason",
      "three: second thing",
      "three: third thing",
    ]);
  });

  it("returns an empty array when every check reports no violation", () => {
    expect(gated([["two", (): readonly string[] => []]], {})).toStrictEqual([]);
  });
});
