import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";

import { type Theme } from "#authoring/theme.ts";
import { foundation } from "#preset/index.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";
import { statement } from "#preset/statement.ts";
import { tokens } from "#preset/tokens/index.ts";

const THEME: Theme = {
  axes: statement,
  fonts: [],
  name: "foundation",
  preset: foundation,
  variant: { semanticTokens, tokens },
};

describe("foundation", () => {
  it("names the package that publishes it", () => {
    expect(foundation.name).toBe("@stealthscale/theme");
  });

  it("holds no recipe", () => {
    expect(foundation.theme?.extend?.recipes).toBeUndefined();
    expect(foundation.theme?.extend?.slotRecipes).toBeUndefined();
  });

  it("names no preset beneath it", () => {
    expect(foundation.presets).toBeUndefined();
  });

  it("adds to each section rather than replacing it", () => {
    expect(Object.keys(foundation.theme ?? {})).toStrictEqual(["extend"]);
    expect(Object.keys(foundation.theme?.extend ?? {}).toSorted()).toStrictEqual([
      "animationStyles",
      "breakpoints",
      "containers",
      "keyframes",
      "layerStyles",
      "semanticTokens",
      "textStyles",
      "tokens",
    ]);
  });

  it("states the conditions and the utilities and the global styles", () => {
    expect(foundation.conditions).toBeDefined();
    expect(foundation.utilities).toBeDefined();
    expect(foundation.globalCss).toBeDefined();
  });

  it("registers the custom properties its animations interpolate", () => {
    expect(foundation.globalVars).toBeDefined();
  });

  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(violations(THEME, { recipes: [] })).toStrictEqual([]);
  });
});
