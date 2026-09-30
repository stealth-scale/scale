import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#tour/index.ts";

describe("index", () => {
  it("exports the thirteen parts with Actions and useTour", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ActionTrigger",
      "Actions",
      "Arrow",
      "ArrowTip",
      "Backdrop",
      "CloseTrigger",
      "Content",
      "Control",
      "Description",
      "Positioner",
      "ProgressText",
      "Root",
      "Spotlight",
      "Title",
      "useTour",
    ]);
  });

  it("exports no recipe binding or context", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|split|ApiProvider|PropsProvider|useTourContext)/u);
    }
  });

  it("throws for every part that reads the machine rendered outside a root", () => {
    const { Control: _control, Root: _root, useTour: _useTour, ...parts } = barrel;

    expect(
      rootedViolations(parts, "A part of Tour was drawn outside the root that holds it together."),
    ).toStrictEqual([]);
  });

  it("throws for the control rendered outside a root", () => {
    const { Control } = barrel;

    expect(rootedViolations({ Control }, /missing its Provider/u)).toStrictEqual([]);
  });
});
