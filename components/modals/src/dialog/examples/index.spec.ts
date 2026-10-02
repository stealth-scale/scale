import { describe, expect, it } from "vitest";

import * as examples from "#dialog/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "confirm",
      "invite",
      "members",
      "palette",
      "settings",
      "shortcuts",
      "terms",
    ]);
  });
});
