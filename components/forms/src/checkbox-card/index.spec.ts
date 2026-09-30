import { describe, expect, it } from "vitest";

import * as CheckboxCard from "#checkbox-card/index.ts";

describe("index", () => {
  it("exports the seven parts by their short names", () => {
    expect(Object.keys(CheckboxCard).toSorted()).toStrictEqual([
      "Addon",
      "Content",
      "Control",
      "Description",
      "Indicator",
      "Label",
      "Root",
    ]);
  });
});
