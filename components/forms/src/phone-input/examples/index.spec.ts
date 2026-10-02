import { describe, expect, it } from "vitest";

import * as examples from "#phone-input/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "callback",
      "contact",
      "everywhere",
      "flags",
      "national",
    ]);
  });
});
