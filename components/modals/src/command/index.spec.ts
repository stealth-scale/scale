import { describe, expect, it } from "vitest";

import * as barrel from "#command/index.ts";

describe("index", () => {
  it("limits its runtime exports to Empty Input List and Root", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Empty", "Input", "List", "Root"]);
  });

  it("exports no name prefixed with recipe with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
