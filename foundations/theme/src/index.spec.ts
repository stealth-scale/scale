import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

const SURFACE = [
  "breakpointKeys",
  "breakpoints",
  "COLOR_MODE_ATTRIBUTE",
  "createRecipeContext",
  "createSlotRecipeContext",
  "css",
  "cx",
  "styled",
  "THEME_ATTRIBUTE",
  "ThemeProvider",
  "token",
  "useTheme",
];

describe("theme", () => {
  it("publishes what a component imports and nothing from the authoring entry", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
