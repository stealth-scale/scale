import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#sortable/recipe.ts";
import page from "#sortable/sortable.specimen.tsx";

/**
 * Returns the base styles of a slot.
 */
function base(slot: string): unknown {
  return (recipe.base as Readonly<Record<string, unknown>> | undefined)?.[slot];
}

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Sortable.Root", "Sortable.Board", "Sortable.Item"] }),
    ).toStrictEqual([]);
  });

  it("sets className to sortable", () => {
    expect(recipe.className).toBe("sortable");
  });

  it("declares ten slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "board",
      "lanes",
      "list",
      "items",
      "item",
      "handle",
      "fixed",
      "itemContent",
      "empty",
    ]);
  });

  it("declares no axes", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("hides the content of dnd-kit's placeholder", () => {
    expect(base("item")).toMatchObject({
      "&[data-dnd-placeholder]": { "& > *": { visibility: "hidden" } },
    });
  });

  it("dims the rows of a list that refuses the dragged item", () => {
    expect(base("list")).toMatchObject({
      "&[data-refuses]": { "& .sortable__item": { opacity: "muted" } },
    });
  });

  it("sets touch-action none on the handle", () => {
    expect(base("handle")).toMatchObject({ touchAction: "none" });
  });

  it("keeps a list at least as wide as its flex basis", () => {
    expect(base("list")).toMatchObject({ flexBasis: "{sizes.60}", minInlineSize: "{sizes.60}" });
  });
});
