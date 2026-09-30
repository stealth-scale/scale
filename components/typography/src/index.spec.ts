import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports every component of the package only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Blockquote",
      "Code",
      "Em",
      "Heading",
      "Highlight",
      "Icon",
      "Kbd",
      "List",
      "Mark",
      "MarkPropsProvider",
      "Quote",
      "Span",
      "Strong",
      "Text",
    ]);
  });

  it("exports the parts of Blockquote as a namespace", () => {
    expect(Object.keys(barrel.Blockquote).toSorted()).toStrictEqual([
      "Caption",
      "Content",
      "Icon",
      "Root",
    ]);
  });

  it("exports the parts of Kbd as a namespace", () => {
    expect(Object.keys(barrel.Kbd).toSorted()).toStrictEqual(["Group", "Root"]);
  });

  it("exports the parts of List as a namespace", () => {
    expect(Object.keys(barrel.List).toSorted()).toStrictEqual(["Indicator", "Item", "Root"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
