import { describe, expect, it } from "vitest";

import actions from "@stealthscale/example-lib-actions/theme";
import surfaces from "@stealthscale/example-lib-surfaces/theme";
import { extendedRecipes, publishedRecipes, violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { DEPTH, forge } from "#index.ts";

const published = publishedRecipes(actions, surfaces);

describe("forge", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(forge, {
        at: import.meta.dirname,
        base: foundation,
        recipes: published,
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(forge.name).toBe("forge");
  });

  it("casts every shadow with half the default ink in the neutral hue", () => {
    expect(DEPTH).toBe(0.5);
    expect(forge.variant.semanticTokens?.shadows?.["md"]).toStrictEqual({
      value:
        "0 4px 8px light-dark(oklch(20% 0.02 70 / 0.040), oklch(0% 0.02 70 / 0.120)), inset 0 0 0 1px light-dark(transparent, oklch(100% 0 0 / 0.12))",
    });
  });

  it("extends the button and the card and nothing else", () => {
    expect(extendedRecipes(forge)).toStrictEqual(["button", "card"]);
  });

  it("reports each extension under a key no package publishes", () => {
    expect(violations(forge, { base: foundation, recipes: [] })).toStrictEqual([
      "contract.extensions: forge extends button, which no package publishes",
      "contract.extensions: forge extends card, which no package publishes",
    ]);
  });
});
