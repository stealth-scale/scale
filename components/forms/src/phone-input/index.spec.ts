import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#phone-input/index.ts";

describe("index", () => {
  it("exports the three parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Country", "Input", "Root"]);
  });

  it("throws for each part rendered outside a root", () => {
    expect(
      rootedViolations(
        { Country: barrel.Country, Input: barrel.Input },
        "A part of PhoneInput.Root was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
