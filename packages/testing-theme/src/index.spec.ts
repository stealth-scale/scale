import { describe, expect, expectTypeOf, it } from "vitest";

import {
  type Application,
  SEPARATOR,
  type Theme,
  THEME_ATTRIBUTE,
} from "@stealthscale/theme/authoring";
import {
  type Theme as Loaded,
  THEME_ATTRIBUTE as pluginAttribute,
  SEPARATOR as pluginSeparator,
  type Application as Stated,
  type Switchable,
} from "@stealthscale/vite-plugin-theme";

import * as published from "#index.ts";

const SURFACE = [
  "axesOf",
  "boundMachineViolations",
  "boundViolations",
  "byStep",
  "classesOf",
  "colorAt",
  "compoundClass",
  "DEFICIENCIES",
  "defaultsOf",
  "distance",
  "distanceFor",
  "extendedRecipes",
  "fontsOf",
  "formatReport",
  "gamut",
  "outsideGamut",
  "palettesOf",
  "presetViolations",
  "publishedRecipes",
  "rampsOf",
  "recipeClass",
  "recipeClasses",
  "recipeElement",
  "recipeViolations",
  "report",
  "resolved",
  "scaleOf",
  "simulated",
  "slotClass",
  "slotClasses",
  "slotElement",
  "slotVariantClass",
  "slotsOf",
  "statusPairs",
  "THRESHOLDS",
  "valuesOf",
  "variantClass",
  "violations",
  "written",
];

describe("testing-theme", () => {
  it("exports exactly the names the surface list declares", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });

  it("matches the build plugin on the separator the theme attribute and the theme types", () => {
    expect(published.THRESHOLDS.text).toBe(7);
    expect(SEPARATOR).toBe(pluginSeparator);
    expect(THEME_ATTRIBUTE).toBe(pluginAttribute);

    expectTypeOf<Theme>().toExtend<Switchable>();
    expectTypeOf<Theme>().toExtend<Loaded>();
    expectTypeOf<Application>().toExtend<Stated>();
  });
});
