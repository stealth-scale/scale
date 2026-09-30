import { describe, expect, it } from "vitest";

import * as examples from "#details/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual(["declined", "faq", "refund"]);
  });
});
