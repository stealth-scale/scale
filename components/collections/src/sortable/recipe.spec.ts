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

  it("declares the variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["variant"]);
  });

  it("defaults to the card look", () => {
    expect(recipe.defaultVariants).toStrictEqual({ variant: "card" });
  });

  it.each(["card", "plain"] as const)(
    "hides the content of dnd-kit's placeholder in the %s look",
    (look) => {
      expect(recipe.variants?.["variant"]?.[look]?.["item"]).toMatchObject({
        "&[data-dnd-placeholder]": { "& > *": { visibility: "hidden" } },
      });
    },
  );

  it("renders a card row on the panel's fill with a hairline edge", () => {
    expect(recipe.variants?.["variant"]?.["card"]?.["item"]).toMatchObject({
      background: "bg.panel",
      borderColor: "border",
      borderWidth: "hairline",
    });
  });

  it("renders a plain row with a transparent edge", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["item"]).toMatchObject({
      borderColor: "transparent",
      borderWidth: "hairline",
    });
  });

  it("renders a plain row as tall as its handle", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["item"]).toMatchObject({ paddingBlock: "0" });
  });

  it("lifts a plain row a person drags on the panel's fill", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["item"]).toMatchObject({
      "&[data-dnd-dragging]": { background: "bg.panel", boxShadow: "lg" },
    });
  });

  it("lets plain rows touch each other", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["items"]).toStrictEqual({ gap: "0" });
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
