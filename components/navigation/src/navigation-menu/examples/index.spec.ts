import { describe, expect, it } from "vitest";

import * as examples from "#navigation-menu/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "aligned",
      "click",
      "controlled",
      "header",
      "inline",
      "sidebar",
    ]);
  });
});
