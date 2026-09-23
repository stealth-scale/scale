import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#status/recipe.ts";
import page from "#status/status.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Status.Root", "Status.Indicator"],
        parts: ["root", "indicator"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to status", () => {
    expect(recipe.className).toBe("status");
  });

  it("declares effect palette and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "size"]);
  });

  it("defaults to the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("emits every palette whether or not a page sets it", () => {
    expect(recipe.staticCss).toStrictEqual([
      {
        palette: [
          "primary",
          "secondary",
          "accent",
          "neutral",
          "info",
          "success",
          "warning",
          "error",
        ],
      },
    ]);
  });

  it("draws the dot in the solid role of the palette and keeps it in forced colors", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      background: "colorPalette.solid",
      forcedColorAdjust: "none",
    });
  });

  it("aligns the word on the baseline and centres the dot on its own", () => {
    expect(recipe.base?.["root"]).toMatchObject({ alignItems: "baseline" });
    expect(recipe.base?.["indicator"]).toMatchObject({ alignSelf: "center" });
  });

  it("sizes the dot and the gap in em so they follow the text", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ blockSize: "0.64em", inlineSize: "0.64em" });
    expect(recipe.base?.["root"]).toMatchObject({ gap: "0.5em" });
  });

  it("sets the label text style one size smaller than the size", () => {
    expect(recipe.variants?.["size"]?.["lg"]).toStrictEqual({ root: { textStyle: "label.md" } });
  });

  it("inherits the surrounding font when size is inherit", () => {
    expect(recipe.variants?.["size"]?.["inherit"]).toStrictEqual({
      root: { fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" },
    });
  });

  it("animates the halo with pulse-glow when effect is pulse", () => {
    expect(recipe.variants?.["effect"]?.["pulse"]).toStrictEqual({
      indicator: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    });
  });
});
