import { describe, expect, it } from "vitest";

import { isolated, toggled } from "#chart/hidden.ts";

const KEYS = ["paid", "refunded", "disputed"];

describe("hidden", () => {
  it("hides every other series when a shown series is isolated", () => {
    expect(isolated([], "paid", KEYS)).toStrictEqual(["refunded", "disputed"]);
  });

  it("shows every series when the series shown alone is isolated again", () => {
    expect(isolated(["refunded", "disputed"], "paid", KEYS)).toStrictEqual([]);
  });

  it("shows only the pressed series when a hidden series is isolated", () => {
    expect(isolated(["refunded", "disputed"], "refunded", KEYS)).toStrictEqual([
      "paid",
      "disputed",
    ]);
  });

  it("hides a shown series when it is toggled", () => {
    expect(toggled([], "refunded", KEYS)).toStrictEqual(["refunded"]);
  });

  it("shows a hidden series when it is toggled", () => {
    expect(toggled(["refunded"], "refunded", KEYS)).toStrictEqual([]);
  });

  it("keeps the last series shown when it is toggled", () => {
    expect(toggled(["refunded", "disputed"], "paid", KEYS)).toStrictEqual(["refunded", "disputed"]);
  });
});
