import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Accordion",
      "Collapsible",
      "Details",
      "HoverCard",
      "Menu",
      "Menubar",
      "Popover",
      "Steps",
      "Tabs",
      "ToggleTip",
      "Tooltip",
      "Truncate",
    ]);
  });

  it("publishes a component with parts as a namespace of its short names", () => {
    expect(Object.keys(barrel.Collapsible).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
      "Root",
      "Trigger",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
