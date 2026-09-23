import { describe, expect, it } from "vitest";

import * as barrel from "#textarea/index.ts";

describe("index", () => {
  it("exports Textarea only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Textarea"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
