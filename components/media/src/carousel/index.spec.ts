import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#carousel/index.ts";

describe("index", () => {
  it("exports the twelve parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "AutoplayIndicator",
      "AutoplayTrigger",
      "Control",
      "Indicator",
      "IndicatorGroup",
      "Indicators",
      "Item",
      "ItemGroup",
      "NextTrigger",
      "PrevTrigger",
      "ProgressText",
      "Root",
    ]);
  });

  it("throws for every part rendered outside a root", () => {
    const {
      AutoplayIndicator,
      AutoplayTrigger,
      Control,
      Indicator,
      IndicatorGroup,
      Indicators,
      Item,
      ItemGroup,
      NextTrigger,
      PrevTrigger,
      ProgressText,
    } = barrel;

    expect(
      rootedViolations(
        {
          AutoplayIndicator,
          AutoplayTrigger,
          Control,
          Indicator,
          IndicatorGroup,
          Indicators,
          Item,
          ItemGroup,
          NextTrigger,
          PrevTrigger,
          ProgressText,
        },
        "A part of Carousel was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
