import { describe, expect, it } from "vitest";

import collections from "@stealthscale/component-collections/theme";
import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#command/command.specimen.tsx";
import { recipe } from "#command/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("reports no violation across the shared recipe checks", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Command"],
        parts: ["root", "control", "indicator", "input", "clear", "list", "empty", "shortcut"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to command", () => {
    expect(recipe.className).toBe("command");
  });

  it("declares its eight slots in the order the palette renders them", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "control",
      "indicator",
      "input",
      "clear",
      "list",
      "empty",
      "shortcut",
    ]);
  });

  it("declares the palette and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size"]);
  });

  it("defaults to md in the neutral palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ palette: "neutral", size: "md" });
  });

  it("sets the palette on the root", () => {
    expect(Object.keys(recipe.variants?.["palette"]?.["primary"] ?? {})).toStrictEqual(["root"]);
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("draws no outline on the bar", () => {
    expect(JSON.stringify(recipe.base?.["control"])).not.toContain("outline");
  });

  it("clears the border and the outline on the input slot", () => {
    expect(recipe.base?.["input"]).toMatchObject({ borderStyle: "none", outline: "none" });
  });

  it("lays the list out as a column that shrinks below its rows", () => {
    expect(recipe.base?.["list"]).toStrictEqual({
      display: "flex",
      flexDirection: "column",
      minBlockSize: "0",
    });
  });

  it("adds a gap step below the size to the block padding of the listbox's rows", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["list"]).toStrictEqual({
      "& .listbox__rows": {
        paddingBlock: "calc(calc({spacing.gap.sm} * var(--density, 1)) + {spacing.gap.xs})",
      },
    });
  });

  it("adds the padding the listbox recipe gives its rows", () => {
    expect(collections).toMatchObject({
      theme: {
        extend: { slotRecipes: { listbox: { base: { rows: { padding: "{spacing.gap.xs}" } } } } },
      },
    });
  });

  it("leaves overflowY unset on the root slot", () => {
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("matches Command and its dotted parts with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^Command(\.\w+)?$/u]);
  });
});
