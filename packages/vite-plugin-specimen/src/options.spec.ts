import { describe, expect, it } from "vitest";

import { ID, PROPS } from "#options.ts";

describe("options", () => {
  it("names the index under a scheme no installed package can carry", () => {
    expect(ID).toBe("virtual:specimen-index");
  });

  it("keeps the props specifier apart from the index so neither claims the other", () => {
    expect(PROPS.startsWith(ID)).toBe(false);
  });
});
