import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#slider/index.ts";

describe("index", () => {
  it("exports the ten parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Control",
      "DraggingIndicator",
      "Label",
      "Marker",
      "MarkerGroup",
      "Range",
      "Root",
      "Thumb",
      "Track",
      "ValueText",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Slider was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
