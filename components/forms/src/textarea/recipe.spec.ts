import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe, VALUE } from "#textarea/recipe.ts";
import page from "#textarea/textarea.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, { names: ["Textarea"], parts: ["root", "control"] }),
    ).toStrictEqual([]);
  });

  it("names its class textarea", () => {
    expect(recipe.className).toBe("textarea");
  });

  it("styles the two parts a textarea draws", () => {
    expect(recipe.slots).toStrictEqual(["root", "control"]);
  });

  it("offers the five axes a textarea takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["grip", "grows", "size", "status", "variant"]);
  });

  it("draws an outlined box a person drags taller when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ grip: "vertical", size: "md", variant: "outline" });
  });

  it("offers the three ways a person drags the box bigger", () => {
    expect(valuesOf(recipe, "grip")).toStrictEqual(["both", "none", "vertical"]);
  });

  it("names the drag axis apart from the CSS property it writes", () => {
    expect(axesOf(recipe)).not.toContain("resize");
  });

  it("measures the text with a copy drawn in the same grid cell", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&::after": { content: `attr(${VALUE}) " "`, visibility: "hidden" },
      display: "grid",
    });
  });

  it("holds the height open where a line ends in a newline", () => {
    expect(recipe.base?.["root"]?.["&::after"]).toMatchObject({ whiteSpace: "pre-wrap" });
  });

  it("wraps the copy and the control at one width", () => {
    const copy = recipe.base?.["root"]?.["&::after"];

    expect(copy).toMatchObject({ gridArea: "1 / 1 / 2 / 2", padding: "0" });
    expect(recipe.base?.["control"]).toMatchObject({ gridArea: "1 / 1 / 2 / 2", padding: "0" });
  });

  it("stops a growing box being dragged against its own measurement", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "textarea__control--measured",
        css: { control: { resize: "none" } },
        grip: ["both", "vertical"],
        grows: true,
      },
    ]);
  });

  it("tracks the tag named Textarea", () => {
    expect(recipe.jsx).toStrictEqual([/^Textarea$/u]);
  });
});
