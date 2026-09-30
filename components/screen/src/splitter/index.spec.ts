import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#splitter/index.ts";

describe("index", () => {
  it("exports the five parts and the machine's hook alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Panel",
      "ResizeTrigger",
      "ResizeTriggerIndicator",
      "ResizeTriggerSeparator",
      "Root",
      "useSplitter",
    ]);
  });

  it("throws for every part that reads the splitter rendered outside a root", () => {
    const { Root: _root, useSplitter: _hook, ...parts } = barrel;

    expect(
      rootedViolations(
        parts,
        "A part of Splitter was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
