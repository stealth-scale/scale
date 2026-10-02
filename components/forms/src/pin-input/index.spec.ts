import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#pin-input/index.ts";

describe("index", () => {
  it("exports the four parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Control", "Input", "Label", "Root"]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of PinInput was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
