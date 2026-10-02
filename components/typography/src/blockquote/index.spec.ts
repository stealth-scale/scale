import { describe, expect, it } from "vitest";

import * as barrel from "#blockquote/index.ts";

describe("index", () => {
  it("limits its runtime exports to the four parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Caption", "Content", "Icon", "Root"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
