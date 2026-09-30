import { describe, expect, it } from "vitest";

import { recipe } from "#listbox/recipe.ts";
import { DESCRIBED, SELECTED } from "#listbox/selected.ts";

describe("SELECTED", () => {
  it.each(["plain", "solid", "subtle"] as const)(
    "fills a selected row with Highlight under forced colors in the %s look",
    (look) => {
      expect(SELECTED[look].item).toMatchObject({
        _selected: {
          _highContrast: {
            background: "Highlight",
            color: "HighlightText",
            forcedColorAdjust: "none",
          },
        },
      });
    },
  );

  it("leaves a selected row unfilled under forced colors in the none look", () => {
    expect(SELECTED.none).toStrictEqual({ item: { _selected: { fontWeight: "inherit" } } });
  });

  it.each(["solid", "subtle"] as const)(
    "restates the forced fill under a pointer on a selected row in the %s look",
    (look) => {
      expect(SELECTED[look].item).toMatchObject({
        _selected: {
          _hover: {
            _selected: {
              _highContrast: {
                background: "Highlight",
                color: "HighlightText",
                forcedColorAdjust: "none",
              },
            },
          },
        },
      });
    },
  );

  it("fills a selected row with the palette's subtle fill in the subtle look", () => {
    expect(SELECTED.subtle.item).toMatchObject({ _selected: { layerStyle: "flat.subtle" } });
  });

  it("fills a selected row with the palette's solid fill in the solid look", () => {
    expect(SELECTED.solid.item).toMatchObject({ _selected: { layerStyle: "flat.solid" } });
  });

  it("sets a selected row's text in medium weight in the plain look", () => {
    expect(SELECTED.plain.item).toMatchObject({ _selected: { fontWeight: "medium" } });
  });

  it("draws the highlight's line on a selected row in HighlightText under forced colors", () => {
    expect(SELECTED.subtle.item).toMatchObject({
      _selected: { _highlighted: { _highContrast: { outlineColor: "HighlightText" } } },
    });
  });

  it("fills a selected row's checkbox with HighlightText under forced colors", () => {
    expect(SELECTED.subtle.itemCheckbox).toStrictEqual({
      "[data-selected] > &": {
        _highContrast: {
          background: "HighlightText",
          borderColor: "HighlightText",
          color: "Highlight",
        },
      },
    });
  });

  it("inks a selected row's description in HighlightText under forced colors", () => {
    expect(SELECTED.subtle.itemDescription).toStrictEqual({
      [DESCRIBED]: { _highContrast: { color: "HighlightText" } },
    });
  });

  it("names the row by the class of the listbox recipe", () => {
    expect(DESCRIBED).toBe(`.${recipe.className}__item[data-selected] &`);
  });
});
