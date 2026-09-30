import { describe, expect, it } from "vitest";

import * as examples from "#section/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "cards",
      "members",
      "settings",
      "sizes",
    ]);
  });
});
