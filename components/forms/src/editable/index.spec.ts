import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#editable/index.ts";

describe("index", () => {
  it("exports the ten parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Area",
      "CancelTrigger",
      "Control",
      "EditTrigger",
      "Input",
      "Label",
      "Preview",
      "Root",
      "SubmitTrigger",
      "Textarea",
    ]);
  });

  it("throws for every part other than Root rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Editable was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
