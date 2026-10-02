import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#progress-circle/index.ts";

describe("index", () => {
  it("exports the six parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Circle",
      "Label",
      "Range",
      "Root",
      "Track",
      "ValueText",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Progress was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
