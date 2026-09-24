import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import { Content } from "#collapsible/content.tsx";
import * as barrel from "#collapsible/index.ts";
import { Indicator } from "#collapsible/indicator.tsx";
import { Trigger } from "#collapsible/trigger.tsx";

describe("index", () => {
  it("exports the four parts alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
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
        { Content, Indicator, Trigger },
        "A part of Collapsible was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
