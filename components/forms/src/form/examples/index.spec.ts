import { describe, expect, it } from "vitest";

import * as examples from "#form/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "billing",
      "checkout",
      "contact",
      "controls",
      "freelancer",
      "glyphs",
      "invoice",
      "onboarding",
      "password",
      "payout",
      "preferences",
      "register",
      "signin",
      "subscription",
    ]);
  });
});
