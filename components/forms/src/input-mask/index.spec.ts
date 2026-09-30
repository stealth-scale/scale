import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#input-mask/index.ts";

describe("index", () => {
  it("exports the two parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Input", "Root"]);
  });

  it("throws for the input rendered outside a root", () => {
    const { Root: _root, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of InputMask was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
