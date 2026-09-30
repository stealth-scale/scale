import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { CLASS, recipe } from "#swap/recipe.ts";
import page from "#swap/swap.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Swap.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to swap", () => {
    expect(recipe.className).toBe(CLASS);
  });

  it("declares the root and the indicator slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "indicator"]);
  });

  it("declares the motion axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion"]);
  });

  it("offers four motions", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "none", "scale", "slide"]);
  });

  it("defaults to the scale motion", () => {
    expect(recipe.defaultVariants).toStrictEqual({ motion: "scale" });
  });

  it("lays the root out as an inline grid with its items centred", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "inline-grid", placeItems: "center" });
  });

  it("places every indicator in the root's one cell", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ gridArea: "1 / 1 / 2 / 2" });
  });

  it("keeps the room of an indicator with data-hidden", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      "&[data-hidden]": { visibility: "hidden" },
    });
  });

  it.each([
    { enter: "scale-fade.in", exit: "scale-fade.out", motion: "scale" },
    { enter: "fade.in", exit: "fade.out", motion: "fade" },
    { enter: "slide-up.in", exit: "slide-up.out", motion: "slide" },
  ] as const)(
    "enters with $enter and leaves with $exit under $motion",
    ({ enter, exit, motion }) => {
      expect(recipe.variants?.motion?.[motion]?.indicator).toMatchObject({
        _closed: { animationStyle: exit },
        _open: { animationStyle: enter },
      });
    },
  );

  it("scales a mark from half its size under scale", () => {
    expect(recipe.variants?.motion?.["scale"]?.indicator).toMatchObject({
      "--scale-distance": "0.5",
    });
  });

  it("runs no motion under none", () => {
    expect(recipe.variants?.motion?.["none"]).toStrictEqual({ indicator: { animation: "none" } });
  });
});
