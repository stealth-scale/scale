import { describe, expect, it } from "vitest";

import * as examples from "#tour/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "announcement",
      "checklist",
      "onboarding",
      "placement",
      "project",
      "tips",
    ]);
  });
});
