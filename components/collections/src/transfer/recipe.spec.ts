import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe as listbox } from "#listbox/recipe.ts";
import { LISTBOX, recipe, ROWS } from "#transfer/recipe.ts";
import page from "#transfer/transfer.specimen.tsx";

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
        names: ["Transfer"],
        // The transfer does not run a machine, so every slot is the recipe's own.
        parts: ["root", "side", "controls", "control"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to transfer", () => {
    expect(recipe.className).toBe("transfer");
  });

  it("declares four slots", () => {
    expect(recipe.slots).toHaveLength(4);
  });

  it("declares the palette and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size"]);
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["info"]).toStrictEqual({
      root: { colorPalette: "info" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("defaults size to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("gives both sides an equal share of the width", () => {
    expect(recipe.base?.["side"]).toMatchObject({ flex: "1", minInlineSize: "0" });
  });

  it("sizes a side's list from the row height and --transfer-rows", () => {
    expect(recipe.base?.["side"]).toMatchObject({
      "& .listbox__content": { minBlockSize: `calc(var(--listbox-row) * var(${ROWS}))` },
    });
  });

  it("selects the listbox by its recipe's class name", () => {
    expect(LISTBOX).toBe(listbox.className);
  });

  it("stretches a side's list frame", () => {
    expect(recipe.base?.["side"]).toMatchObject({ "& .listbox__frame": { flex: "1" } });
  });

  it("centres the controls on the pair's height", () => {
    expect(recipe.base?.["controls"]).toMatchObject({ alignSelf: "center" });
  });

  it("sizes a control one control size below the transfer's", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["control"]).toMatchObject({
      boxSize: "calc({sizes.control.sm} * var(--density, 1))",
    });
  });

  it("matches every Transfer tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Transfer(\.\w+)?$/u]);
  });
});
