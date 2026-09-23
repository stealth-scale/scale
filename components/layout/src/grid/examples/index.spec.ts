import { describe, expect, it } from "vitest";

import * as examples from "#grid/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "dashboard",
      "day",
      "days",
      "launch",
      "notes",
      "plan",
      "plans",
      "statuses",
    ]);
  });
});
