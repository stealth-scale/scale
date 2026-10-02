import { describe, expect, it } from "vitest";

import { initialsOf } from "#avatar/initials.ts";

describe("initialsOf", () => {
  it.each([
    { name: "Ada Okafor", want: "AO" },
    { name: "Ada", want: "A" },
    { name: "Ada B. Okafor", want: "AO" },
    { name: "  ada   okafor  ", want: "ao" },
    { name: "Émile Zola", want: "ÉZ" },
    { name: "👩🏽‍💻 Devi", want: "👩🏽‍💻D" },
    { name: "", want: "" },
    { name: "   ", want: "" },
  ])("returns $want for $name", ({ name, want }) => {
    expect(initialsOf(name)).toBe(want);
  });
});
