import { describe, expect, it } from "vitest";

import * as examples from "#signature-pad/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "consent",
      "download",
      "pen",
      "saved",
      "typed",
      "undo",
    ]);
  });
});
