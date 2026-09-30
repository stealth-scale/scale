import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#signature-pad/index.ts";

describe("index", () => {
  it("exports the six parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ClearTrigger",
      "Control",
      "Guide",
      "Label",
      "Root",
      "Segment",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of SignaturePad was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
