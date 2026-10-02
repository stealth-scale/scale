import { describe, expect, it } from "vitest";

import * as examples from "#carousel/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "cards",
      "controlled",
      "gallery",
      "rotation",
      "vertical",
    ]);
  });
});
