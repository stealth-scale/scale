import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { ArrowTip } from "#tooltip/arrow-tip.tsx";
import { Arrow } from "#tooltip/arrow.tsx";
import { Content } from "#tooltip/content.tsx";
import * as barrel from "#tooltip/index.ts";
import { Positioner } from "#tooltip/positioner.tsx";
import { Trigger } from "#tooltip/trigger.tsx";

describe("index", () => {
  it("exports the six parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Arrow",
      "ArrowTip",
      "Content",
      "Positioner",
      "Root",
      "Trigger",
    ]);
  });

  it("exports no recipe binding or machine", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|split|ApiProvider|PropsProvider)/u);
    }
  });

  it("throws for every part rendered outside a root", () => {
    expect(
      rootedViolations(
        { Arrow, ArrowTip, Content, Positioner, Trigger },
        "A part of Tooltip was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
