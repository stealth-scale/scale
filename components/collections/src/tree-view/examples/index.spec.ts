import { describe, expect, it } from "vitest";

import * as examples from "#tree-view/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "docs",
      "explorer",
      "lazy",
      "outline",
      "permissions",
      "rename",
      "search",
    ]);
  });
});
