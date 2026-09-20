import { describe, expect, it } from "vitest";

import { axis } from "#authoring/recipes/axis.ts";

const tones = axis(["muted", "plain", "solid"], (tone) => ({ color: `fg.${tone}` }));

describe("axis", () => {
  it("writes every value in the order given when a recipe names none", () => {
    expect(Object.keys(tones())).toStrictEqual(["muted", "plain", "solid"]);
    expect(tones()).toStrictEqual({
      muted: { color: "fg.muted" },
      plain: { color: "fg.plain" },
      solid: { color: "fg.solid" },
    });
  });

  it("writes the values a recipe names and no other", () => {
    expect(tones(["solid"])).toStrictEqual({ solid: { color: "fg.solid" } });
  });
});
