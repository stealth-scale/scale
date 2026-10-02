import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#status-matrix/recipe.ts";
import page from "#status-matrix/status-matrix.specimen.tsx";

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
        names: ["StatusMatrix"],
        // The matrix does not run a machine, so every slot is the recipe's own.
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

  it("sets className to status-matrix", () => {
    expect(recipe.className).toBe("status-matrix");
  });

  it("declares eleven slots", () => {
    expect(recipe.slots).toHaveLength(11);
  });

  it("declares the size axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults size to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("sizes the root to its content up to the full width", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      inlineSize: "fit-content",
      maxInlineSize: "full",
    });
  });

  it("fills a lit cell with bg.subtle", () => {
    expect(recipe.base?.["cell"]).toStrictEqual({ "&[data-lit]": { background: "bg.subtle" } });
  });

  it("fills a lit row header with bg.subtle", () => {
    expect(recipe.base?.["rowHeading"]).toMatchObject({
      "&[data-lit]": { background: "bg.subtle" },
    });
  });

  it("fills a lit column header with bg.subtle", () => {
    expect(recipe.base?.["columnHeading"]).toStrictEqual({
      "&[data-lit]": { background: "bg.subtle" },
    });
  });

  it("maps each data-tone to its palette on the mark", () => {
    expect(recipe.base?.["mark"]).toMatchObject({
      "&[data-tone=error]": { colorPalette: "error" },
      "&[data-tone=success]": { colorPalette: "success" },
    });
  });

  it("centres a column's name in a block", () => {
    expect(recipe.base?.["columnLabel"]).toStrictEqual({
      display: "block",
      textAlign: "center",
    });
  });

  it("hides the mark's label visually", () => {
    expect(recipe.base?.["name"]).toStrictEqual({ srOnly: true });
  });

  it("sizes a mark's svg at the icon size of the matrix's size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["mark"]).toStrictEqual({
      "& > svg": { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
    });
  });

  it("sizes the dot one icon size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["dot"]).toStrictEqual({
      boxSize: "calc({sizes.icon.sm} * var(--density, 1))",
    });
  });

  it("matches every StatusMatrix tag", () => {
    expect(recipe.jsx).toStrictEqual([/^StatusMatrix(\.\w+)?$/u]);
  });
});
