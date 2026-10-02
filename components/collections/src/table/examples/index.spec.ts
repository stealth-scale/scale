import { describe, expect, it } from "vitest";

import * as examples from "#table/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "accounts",
      "empty",
      "fixed",
      "linked",
      "notes",
      "payouts",
      "quarters",
      "runs",
      "sections",
      "sortable",
      "weeks",
    ]);
  });
});
