import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#scroll-area/index.ts";

describe("index", () => {
  it("exports the six parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Corner",
      "Root",
      "Scrollbar",
      "Thumb",
      "Viewport",
    ]);
  });

  it("throws for every part rendered outside a root", () => {
    const { Content, Corner, Scrollbar, Thumb, Viewport } = barrel;

    expect(
      rootedViolations(
        { Content, Corner, Scrollbar, Thumb, Viewport },
        "A part of ScrollArea was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
