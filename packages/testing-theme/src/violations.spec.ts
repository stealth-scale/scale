import { describe, expect, it } from "vitest";

import { defineRecipe, defineTheme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";
import { violations } from "#violations.ts";

describe("violations", () => {
  it("reads the published keys and the compounds from a map of recipes", () => {
    const button = defineRecipe({ className: "button", variants: { size: { lg: {}, sm: {} } } });
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { buton: { base: {} }, button: { compoundVariants: [{ css: {}, size: "lg" }] } },
    });

    expect(violations(theme, { recipes: { button } })).toStrictEqual([
      "contract.extensions: abyss extends buton, which no package publishes",
      "contract.compounds: abyss extends button with a compound for size_lg, which the recipe does not declare",
    ]);
  });

  it("passes the foundation wrapped as a theme", () => {
    expect(violations(foundationTheme(), { recipes: [] })).toStrictEqual([]);
  });

  it("passes a palette theme layered on the foundation", () => {
    expect(violations(paletteTheme(), { base: foundation })).toStrictEqual([]);
  });

  it("opens each violation with the check that reported it", () => {
    const theme = paletteTheme({ solid: { value: { base: "{colors.primary.700}" } } });

    expect(violations(theme, { base: foundation })).toStrictEqual(
      expect.arrayContaining([
        "contract.modes: audited primary.solid is not stated in _dark",
        "contrast.text: audited primary.contrast on primary.solid cannot be measured in _dark, below 4.5",
        "status.distinct: audited error.solid and primary.solid cannot be measured in _dark",
      ]),
    );
  });

  it("reports a name a page cannot write as an attribute value", () => {
    expect(
      violations({ ...paletteTheme(), name: "Dark Mode" }, { base: foundation }),
    ).toStrictEqual(["name.attribute: Dark Mode is not a valid attribute value"]);
  });

  it("leaves out a check skipped with a reason", () => {
    const theme = { ...paletteTheme(), name: "Dark Mode" };

    expect(
      violations(theme, { base: foundation, skip: { "name.attribute": "a legacy name" } }),
    ).toStrictEqual([]);
  });

  it("reports a skip that gives no reason", () => {
    expect(
      violations(paletteTheme(), { base: foundation, skip: { "name.attribute": "" } }),
    ).toStrictEqual(["skip of name.attribute gives no reason"]);
  });

  it("reports a font package that does not resolve from the directory given", () => {
    expect(
      violations(
        { ...paletteTheme(), fonts: ["@nope/face"] },
        {
          at: import.meta.dirname,
          base: foundation,
        },
      )[0],
    ).toContain("fonts.installed: audited names @nope/face");
  });

  it("checks the font packages only when a source directory is given", () => {
    expect(
      violations({ ...paletteTheme(), fonts: ["@nope/face"] }, { base: foundation }),
    ).toStrictEqual([]);
  });

  it("checks the extension files only when a source directory is given", () => {
    expect(violations(paletteTheme(), { at: "/nowhere", base: foundation })).toStrictEqual(
      [
        "contract.listed: audited has no source directory at /nowhere",
        "fonts.installed: audited names nothing, which does not resolve from /nowhere",
      ].slice(0, 1),
    );
  });
});
