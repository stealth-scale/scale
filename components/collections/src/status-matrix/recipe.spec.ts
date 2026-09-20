import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#status-matrix/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["StatusMatrix"],
        // A matrix runs no machine and stamps no parts. Every slot is this recipe's own.
        parts: [
          "root",
          "columnHeading",
          "columnLabel",
          "rowHeading",
          "cell",
          "picker",
          "mark",
          "dot",
          "name",
          "legend",
          "legendItem",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("prefixes its classes with the matrix's own name", () => {
    expect(recipe.className).toBe("status-matrix");
  });

  it("styles the eleven parts a matrix adds to a table", () => {
    expect(recipe.slots).toHaveLength(11);
  });

  it("offers the one axis a matrix takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("takes the width of its own contents rather than the width of the page", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      inlineSize: "fit-content",
      maxInlineSize: "full",
    });
  });

  it("lights a crossing one step under the panel it sits on", () => {
    expect(recipe.base?.["cell"]).toStrictEqual({ "&[data-lit]": { background: "bg.subtle" } });
  });

  it("lights a row's own name with the row", () => {
    expect(recipe.base?.["rowHeading"]).toMatchObject({
      "&[data-lit]": { background: "bg.subtle" },
    });
  });

  it("lights a column's name with the column", () => {
    expect(recipe.base?.["columnHeading"]).toStrictEqual({
      "&[data-lit]": { background: "bg.subtle" },
    });
  });

  it("points the palette at the tone a state states", () => {
    expect(recipe.base?.["mark"]).toMatchObject({
      "&[data-tone=error]": { colorPalette: "error" },
      "&[data-tone=success]": { colorPalette: "success" },
    });
  });

  it("centres a column's name over the marks under it", () => {
    expect(recipe.base?.["columnLabel"]).toStrictEqual({
      display: "block",
      textAlign: "center",
    });
  });

  it("takes the words of a mark out of sight", () => {
    expect(recipe.base?.["name"]).toStrictEqual({ srOnly: true });
  });

  it("draws a mark at the size the grid is read at", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["mark"]).toStrictEqual({
      "& > svg": { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
    });
  });

  it("draws a disc a step under the marks beside it", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["dot"]).toStrictEqual({
      boxSize: "calc({sizes.icon.sm} * var(--density, 1))",
    });
  });

  it("tracks every tag under the StatusMatrix namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^StatusMatrix(\.\w+)?$/u]);
  });
});
