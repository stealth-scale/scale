import { describe, expect, it } from "vitest";

import * as barrel from "#page/index.ts";

describe("index", () => {
  it("exports the twenty-two parts and When alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Action",
      "Actions",
      "Aside",
      "Banner",
      "Body",
      "Breadcrumbs",
      "Context",
      "Description",
      "Footer",
      "Header",
      "Leading",
      "Meta",
      "Nav",
      "Palette",
      "Picker",
      "Root",
      "Tab",
      "TabList",
      "Tabs",
      "Title",
      "Toolbar",
      "Trail",
      "When",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|GUTTER|MEASURE|STICKY|stuck)/u);
    }
  });
});
