import { describe, expect, it } from "vitest";

import * as barrel from "#alert/index.ts";

describe("index", () => {
  it("exports the seven parts and LIVES only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Aside",
      "CloseTrigger",
      "Content",
      "Description",
      "Indicator",
      "LIVES",
      "Root",
      "Title",
    ]);
  });

  it("exports no recipe or binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
