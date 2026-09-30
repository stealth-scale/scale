import { describe, expect, it } from "vitest";

import * as examples from "#sparkline/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "builds",
      "errors",
      "launch",
      "offline",
      "primary",
      "replay",
      "revenue",
      "services",
      "target",
    ]);
  });
});
