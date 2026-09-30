import { describe, expect, it } from "vitest";

import * as examples from "#graph/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file but the review example", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "changes",
      "editor",
      "judge",
      "pipeline",
      "services",
      "versions",
      "workflow",
    ]);
  });
});
