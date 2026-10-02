import { describe, expect, it } from "vitest";

import { initialsOf } from "#switcher/choice.ts";

describe("initialsOf", () => {
  it.each([
    { give: "Acme", want: "A" },
    { give: "acme corp", want: "AC" },
    { give: "Northwind Traders International", want: "NT" },
    { give: "  Old   Books ", want: "OB" },
    { give: "", want: "" },
  ])("returns $want for '$give'", ({ give, want }) => {
    expect(initialsOf(give)).toBe(want);
  });
});
