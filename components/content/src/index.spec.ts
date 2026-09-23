import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("limits its runtime exports to CodeBlock", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["CodeBlock"]);
  });

  it("exports the seven parts under the CodeBlock namespace", () => {
    expect(Object.keys(barrel.CodeBlock).toSorted()).toStrictEqual([
      "Code",
      "Content",
      "Control",
      "Copy",
      "Header",
      "Root",
      "Title",
    ]);
  });

  it("exports no name prefixed with recipe with use or PropsProvider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel.CodeBlock)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
