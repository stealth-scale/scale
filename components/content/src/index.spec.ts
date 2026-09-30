import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("limits its runtime exports to CodeBlock JsonTreeView Markdown and Marquee", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "CodeBlock",
      "JsonTreeView",
      "Markdown",
      "Marquee",
    ]);
  });

  it("exports the seven parts under the Marquee namespace", () => {
    expect(Object.keys(barrel.Marquee).toSorted()).toStrictEqual([
      "Content",
      "Edge",
      "Item",
      "PauseIndicator",
      "PauseTrigger",
      "Root",
      "Viewport",
    ]);
  });

  it("exports the two parts under the JsonTreeView namespace", () => {
    expect(Object.keys(barrel.JsonTreeView).toSorted()).toStrictEqual(["Root", "Tree"]);
  });

  it("exports the nine parts under the CodeBlock namespace", () => {
    expect(Object.keys(barrel.CodeBlock).toSorted()).toStrictEqual([
      "Code",
      "Content",
      "Control",
      "Copy",
      "Diff",
      "DiffStat",
      "Header",
      "Root",
      "Title",
    ]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of [...Object.keys(barrel.CodeBlock), ...Object.keys(barrel.JsonTreeView)]) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
