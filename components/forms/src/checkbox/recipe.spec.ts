import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import page from "#checkbox/checkbox.specimen.tsx";
import { recipe } from "#checkbox/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Checkbox"],
        parts: ["root", "control", "indicator", "label"],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name checkbox", () => {
    expect(recipe.className).toBe("checkbox");
  });

  it("declares the four slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "control", "indicator", "label"]);
  });

  it("declares eight axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "motion",
      "palette",
      "radius",
      "size",
      "spread",
      "status",
      "variant",
    ]);
  });

  it("defaults to a solid box at size md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "center",
      palette: "primary",
      radius: "l1",
      size: "md",
      variant: "solid",
    });
  });

  it("offers three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle"]);
  });

  it("offers the four palettes that are not statuses", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "neutral",
      "primary",
      "secondary",
    ]);
  });

  it("emits every palette it offers", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral"],
    });
  });

  it("declares the palette axis before the status axis so a status overrides it", () => {
    const axes = Object.keys(recipe.variants ?? {});

    expect(axes.indexOf("palette")).toBeLessThan(axes.indexOf("status"));
  });

  it("fills a partly-on box the same as a checked box in every look", () => {
    const looks = recipe.variants?.["variant"];

    expect(looks?.["solid"]?.["control"]).toMatchObject({
      _checked: { layerStyle: "fill.solid" },
      _indeterminate: { layerStyle: "fill.solid" },
    });
    expect(looks?.["subtle"]?.["control"]).toMatchObject({
      _checked: { layerStyle: "fill.subtle" },
      _indeterminate: { layerStyle: "fill.subtle" },
    });
    expect(looks?.["outline"]?.["control"]).toMatchObject({
      _checked: { layerStyle: "outline.solid" },
      _indeterminate: { layerStyle: "outline.solid" },
    });
  });

  it("fills a checked box with Highlight under forced colors in every look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).toMatchObject({
        _checked: { _highContrast: { background: "Highlight", forcedColorAdjust: "none" } },
        _indeterminate: { _highContrast: { background: "Highlight", forcedColorAdjust: "none" } },
      });
    }
  });

  it("restates the forced fill under the pointer in every look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).toMatchObject({
        _checked: { _highContrast: { _hover: { _checked: { background: "Highlight" } } } },
        _indeterminate: {
          _highContrast: { _hover: { _indeterminate: { background: "Highlight" } } },
        },
      });
    }
  });

  it("restates the forced fill under the press in every look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).toMatchObject({
        _checked: { _highContrast: { _active: { _checked: { background: "Highlight" } } } },
        _indeterminate: {
          _highContrast: { _active: { _indeterminate: { background: "Highlight" } } },
        },
      });
    }
  });

  it("inverts a checked box inside a selected row under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["control"]).toMatchObject({
      _checked: {
        _highContrast: {
          "[aria-selected=true] &": { background: "HighlightText", color: "Highlight" },
        },
      },
    });
  });

  it("rings a focused checked box in CanvasText under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["control"]).toMatchObject({
      _checked: { _highContrast: { focusRingColor: "CanvasText" } },
    });
  });

  it("writes no border color on any look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).not.toHaveProperty("borderColor");
    }
  });

  it("sizes a mark's svg to the box", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ "& svg": { boxSize: "full" } });
  });

  it("hides the mark while the machine sets hidden", () => {
    expect(recipe.base?.["indicator"]?.["&[hidden]"]).toStrictEqual({ display: "none" });
  });

  it("sets only the cursor on a disabled row", () => {
    expect(recipe.base?.["root"]?.["_disabled"]).toStrictEqual({ cursor: "disabled" });
  });

  it("renders the focus ring outside the box", () => {
    expect(recipe.base?.["control"]).toMatchObject({ focusVisibleRing: "outside" });
  });

  it("widens the target under a coarse pointer without raising the box", () => {
    expect(recipe.base?.["control"]?.["_touch"]).toHaveProperty("_before");
    expect(recipe.base?.["control"]?.["_touch"]).not.toHaveProperty("minBlockSize");
  });

  it("takes the full width on a spread row", () => {
    expect(scaleOf(recipe, "spread", "root", ["true"])[0]).toMatchObject({ inlineSize: "full" });
  });

  it("sets the label in the body role at the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["label"]).toStrictEqual({ textStyle: "body.md" });
  });

  it("tracks JSX named Checkbox and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Checkbox(\.\w+)?$/u]);
  });
});
