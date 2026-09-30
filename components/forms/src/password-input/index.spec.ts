import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#password-input/index.ts";

describe("index", () => {
  it("exports the four parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Indicator",
      "Input",
      "Root",
      "VisibilityTrigger",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of PasswordInput was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
