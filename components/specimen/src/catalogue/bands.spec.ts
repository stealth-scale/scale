import { describe, expect, it } from "vitest";

import { BANDS } from "#catalogue/bands.ts";

describe("BANDS", () => {
  it("names the two bands a page is read in", () => {
    expect(Object.keys(BANDS).toSorted()).toStrictEqual(["examples", "props"]);
  });

  it("carries each band's own name as the value its tab is picked by", () => {
    expect(BANDS).toStrictEqual({ examples: "examples", props: "props" });
  });
});
