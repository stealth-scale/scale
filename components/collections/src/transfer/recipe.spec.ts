import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#transfer/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Transfer"],
        // A transfer runs no machine and stamps no parts. Every slot is this recipe's own.
        parts: ["root", "side", "controls", "control"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class transfer", () => {
    expect(recipe.className).toBe("transfer");
  });

  it("styles the four parts a transfer draws", () => {
    expect(recipe.slots).toHaveLength(4);
  });

  it("offers the one axis a transfer takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("gives both sides the same share of the width", () => {
    expect(recipe.base?.["side"]).toMatchObject({ flex: "1", minInlineSize: "0" });
  });

  it("stands the controls against the middle of the pair rather than its first row", () => {
    expect(recipe.base?.["controls"]).toMatchObject({ alignSelf: "center" });
  });

  it("draws a control a step below the size the lists take", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject({
      boxSize: "calc({sizes.control.sm} * var(--density, 1))",
    });
  });

  it("tracks every tag under the Transfer namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Transfer(\.\w+)?$/u]);
  });
});
