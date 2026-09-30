import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#number-input/index.ts";

describe("index", () => {
  it("exports the five parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "DecrementTrigger",
      "IncrementTrigger",
      "Input",
      "Root",
      "Scrubber",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of NumberInput was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
