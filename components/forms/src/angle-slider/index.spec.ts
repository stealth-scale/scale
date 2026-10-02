import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#angle-slider/index.ts";

describe("index", () => {
  it("exports the nine parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Control",
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

  it("throws for every part that reads the machine rendered outside a root", () => {
    const { Range: _range, Root: _root, Track: _track, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of AngleSlider was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });

  it("throws for the ring's parts rendered outside a root", () => {
    const { Range, Track } = barrel;

    expect(rootedViolations({ Range, Track }, /missing its Provider/u)).toStrictEqual([]);
  });
});
