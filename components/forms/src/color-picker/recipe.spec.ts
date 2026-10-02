import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#color-picker/color-picker.specimen.tsx";
import { CHECKER, GRADIENT } from "#color-picker/metrics.ts";
import { recipe } from "#color-picker/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["ColorPicker.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to color-picker", () => {
    expect(recipe.className).toBe("color-picker");
  });

  it("declares size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("defaults to outline fields at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("declares the sizes a field passes down", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("paints the alpha track's gradient over the checkerboard", () => {
    expect(recipe.base?.["channelSliderTrack"]).toMatchObject({
      "&[data-channel=alpha]": { backgroundImage: `var(${GRADIENT}), ${CHECKER}` },
    });
  });

  it("drops the shadow of a panel rendered in place", () => {
    expect(recipe.base?.["content"]).not.toHaveProperty("boxShadow");
  });

  it("hides the browser's spin buttons on a number input", () => {
    expect(recipe.base?.["channelInput"]).toMatchObject({
      "&[type=number]": { appearance: "textfield" },
    });
  });

  it("hides an indicator the machine marks hidden", () => {
    expect(recipe.base?.["swatchIndicator"]).toMatchObject({
      "&[hidden]": { display: "none" },
    });
  });

  it("keeps the smallest inset on the flushed look for the root and the panel", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]).toMatchObject({
      content: { "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
      root: { "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))" },
    });
  });
});
