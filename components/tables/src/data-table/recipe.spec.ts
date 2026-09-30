import { describe, expect, it } from "vitest";

import typography from "@stealthscale/component-typography/theme";
import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#data-table/data-table.specimen.tsx";
import { EDITOR, EDITOR_ERROR, GRIDDED } from "#data-table/gridded.ts";
import { RULE_WIDTH } from "#data-table/properties.ts";
import { recipe } from "#data-table/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["DataTable.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to data-table", () => {
    expect(recipe.className).toBe("data-table");
  });

  it("declares no axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("hides the visually hidden slot's words from view", () => {
    expect(recipe.base?.["visuallyHidden"]).toStrictEqual({ srOnly: true });
  });

  it("turns the expand indicator a quarter while open", () => {
    expect(recipe.base?.["expandIndicator"]).toMatchObject({ _open: { rotate: "90deg" } });
  });

  it("mirrors the expand indicator under right-to-left", () => {
    expect(recipe.base?.["expandIndicator"]).toMatchObject({
      _rtl: { _open: { rotate: "90deg" }, rotate: "180deg" },
    });
  });

  it("stacks the root's parts in a flex column", () => {
    expect(recipe.base?.["root"]).toMatchObject({ display: "flex", flexDirection: "column" });
  });

  it("turns the sort indicator half a circle for a descending sort", () => {
    expect(recipe.base?.["sortIndicator"]).toMatchObject({
      "&[data-direction=descending]": { rotate: "180deg" },
    });
  });

  it("hides the sort indicator of a column that is not sorted", () => {
    expect(recipe.base?.["sortIndicator"]).toMatchObject({
      "&[data-direction=none]": { opacity: "0" },
    });
  });

  it("shows the unsorted indicator at the muted opacity under the pointer or keyboard focus", () => {
    expect(recipe.base?.["sortIndicator"]).toMatchObject({
      "&[data-direction=none]": { "*:is(:hover, :focus-visible) > &": { opacity: "muted" } },
    });
  });

  it.each(["cell", "columnHeader", "rowHeader"] as const)(
    "sticks a pinned %s on the panel's fill",
    (slot) => {
      expect(recipe.base?.[slot]).toMatchObject({
        "&[data-pinned]": { backgroundColor: "bg.panel", position: "sticky" },
      });
    },
  );

  it("paints a pinned cell's row fill over the panel", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-pinned]": {
        backgroundImage: "linear-gradient(var(--table-row-fill), var(--table-row-fill))",
      },
    });
  });

  it("rules the end of a row that ends a region at the indicator width", () => {
    expect(recipe.base?.["row"]).toMatchObject({
      "&[data-region-end]": { [RULE_WIDTH]: "borderWidths.indicator" },
    });
  });

  it("places a cell pinned to the start at its offset from the inline start", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-pinned=start]": { insetInlineStart: "var(--pin-offset)" },
    });
  });

  it("places a cell pinned to the end at its offset from the inline end", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-pinned=end]": { insetInlineEnd: "var(--pin-offset)" },
    });
  });

  it("paints Canvas under a selected row's pinned cell under forced colors", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-pinned]": {
        "tr[aria-selected=true] > &": { _highContrast: { backgroundColor: "Canvas" } },
      },
    });
  });

  it("rules the inline end of the start region's edge in the row's ink", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-pinned=start][data-pinned-edge]": {
        borderInlineEndColor: "var(--table-rule, {colors.border})",
        borderInlineEndWidth: "indicator",
      },
    });
  });

  it("rules the inline start of the end region's edge in the row's ink", () => {
    expect(recipe.base?.["cell"]).toMatchObject({
      "&[data-pinned=end][data-pinned-edge]": {
        borderInlineStartColor: "var(--table-rule, {colors.border})",
        borderInlineStartWidth: "indicator",
      },
    });
  });

  it("positions a resizable header that is not pinned for its separator", () => {
    expect(recipe.base?.["columnHeader"]).toMatchObject({
      "&[data-resizable]:not([data-pinned])": { position: "relative" },
    });
  });

  it("centres the separator on the header's inline end", () => {
    expect(recipe.base?.["resizer"]).toMatchObject({
      inlineSize: "3",
      insetInlineEnd: "calc({sizes.3} / -2)",
      position: "absolute",
    });
  });

  it("hides the separator's line at rest", () => {
    expect(recipe.base?.["resizer"]).toMatchObject({ _after: { background: "transparent" } });
  });

  it("paints the separator's line Highlight under forced colors while it resizes", () => {
    expect(recipe.base?.["resizer"]).toMatchObject({
      "&:is(:hover, :focus-visible, [data-resizing])": {
        _after: { _highContrast: { background: "Highlight" } },
      },
    });
  });

  it("keeps the last column's separator inside the table's end", () => {
    expect(recipe.base?.["resizer"]).toMatchObject({
      "th:last-child > &": { insetInlineEnd: "0" },
    });
  });

  it("paints the separator's line in the palette's solid while it resizes", () => {
    expect(recipe.base?.["resizer"]).toMatchObject({
      "&:is(:hover, :focus-visible, [data-resizing])": {
        _after: { background: "colorPalette.solid" },
      },
    });
  });

  it("sizes a sized table to --table-size", () => {
    expect(recipe.base?.["table"]).toStrictEqual({
      "&[data-sized]": { inlineSize: "var(--table-size)" },
    });
  });

  it.each(["cell", "columnHeader", "rowHeader"] as const)(
    "fits a %s of a column that fits its content",
    (slot) => {
      expect(recipe.base?.[slot]).toMatchObject({ "&[data-fit]": { inlineSize: "0" } });
    },
  );

  it("caps the search field's width at sizes.xs", () => {
    expect(recipe.base?.["search"]).toStrictEqual({ maxInlineSize: "xs" });
  });

  it("sizes each declared column to --column-size", () => {
    expect(recipe.base?.["column"]).toStrictEqual({ inlineSize: "var(--column-size)" });
  });

  it("lays a header's name and its actions out in an inline row", () => {
    expect(recipe.base?.["heading"]).toMatchObject({
      alignItems: "center",
      display: "inline-flex",
    });
  });

  it("keeps a header's actions at their width", () => {
    expect(recipe.base?.["actions"]).toMatchObject({ display: "flex", flexShrink: "0" });
  });

  it("pulls a header's actions into the header's padding by half an xs button over a line", () => {
    expect(recipe.base?.["actions"]).toMatchObject({
      marginBlock: "calc((1lh - calc({sizes.control.xs} * var(--density, 1))) / 2)",
    });
  });

  it("lays a range filter's two fields out in two equal columns", () => {
    expect(recipe.base?.["range"]).toMatchObject({
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    });
  });

  it("lays the page size's label and select out in a row", () => {
    expect(recipe.base?.["pageSize"]).toMatchObject({
      alignItems: "center",
      display: "inline-flex",
    });
  });

  it("keeps the page size's label on one line", () => {
    expect(recipe.base?.["pageSizeLabel"]).toMatchObject({ whiteSpace: "nowrap" });
  });

  it("places a panel's reset button at the panel's end", () => {
    expect(recipe.base?.["reset"]).toStrictEqual({ alignSelf: "flex-end" });
  });

  it("sizes a filter panel to sizes.60", () => {
    expect(recipe.base?.["panel"]).toStrictEqual({ inlineSize: "60" });
  });

  it("stretches a value filter's box across its panel", () => {
    expect(recipe.base?.["value"]).toStrictEqual({ alignSelf: "stretch" });
  });

  it("puts a value's count at its label's end", () => {
    expect(recipe.base?.["valueLabel"]).toMatchObject({
      display: "flex",
      flex: "1",
      justifyContent: "space-between",
    });
  });

  it("stacks the column manager's list over its reset button", () => {
    expect(recipe.base?.["manager"]).toMatchObject({ display: "flex", flexDirection: "column" });
  });

  it("writes a value's count in the muted ink with tabular figures", () => {
    expect(recipe.base?.["count"]).toStrictEqual({
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
    });
  });

  it("fits a sized table's scroller to the table and caps it at its room", () => {
    expect(recipe.base?.["frame"]).toStrictEqual({
      "&[data-sized]": { inlineSize: "fit-content", maxInlineSize: "full" },
    });
  });

  it("sticks a group of pinned rows on the panel over the rows that scroll", () => {
    expect(recipe.base?.["region"]).toMatchObject({
      backgroundColor: "bg.panel",
      position: "sticky",
      zIndex: "2",
    });
  });

  it("sticks the group pinned to the top under the header", () => {
    expect(recipe.base?.["region"]).toMatchObject({
      "&[data-pinned=top]": { insetBlockStart: "var(--table-head-size)" },
    });
  });

  it("sticks the group pinned to the bottom to the viewport's end", () => {
    expect(recipe.base?.["region"]).toMatchObject({
      "&[data-pinned=bottom]": { insetBlockEnd: "0" },
    });
  });

  it("sizes a spacer row to --spacer-size with a cell without padding", () => {
    expect(recipe.base?.["spacer"]).toStrictEqual({
      "& > td": { padding: "0" },
      blockSize: "var(--spacer-size)",
    });
  });

  it("rings a row with a tab stop inside its edge under keyboard focus", () => {
    expect(recipe.base?.["row"]).toMatchObject({
      "&[tabindex]": {
        _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
        focusRingColor: "colorPalette.focusRing",
        focusVisibleRing: "inside",
      },
    });
  });

  it("lays a row's toggle and its cell's content out in a row", () => {
    expect(recipe.base?.["branch"]).toMatchObject({ alignItems: "center", display: "flex" });
  });

  it("indents a cell's toggle by spacing.6 for each level of --row-depth", () => {
    expect(recipe.base?.["branch"]).toMatchObject({
      paddingInlineStart: "calc(var(--row-depth, 0) * calc({spacing.6} * var(--density, 1)))",
    });
  });

  it("sizes a toggle's box to an xs button", () => {
    expect(recipe.base?.["toggle"]).toMatchObject({
      flexShrink: "0",
      inlineSize: "calc({sizes.control.xs} * var(--density, 1))",
    });
  });

  it("pulls a toggle's box into the cell's padding by half an xs button over a line", () => {
    expect(recipe.base?.["toggle"]).toMatchObject({
      marginBlock: "calc((1lh - calc({sizes.control.xs} * var(--density, 1))) / 2)",
    });
  });

  it.each(["cell", "rowHeader"] as const)(
    "drops the rule of a %s whose span ends on the body's last row before a footer",
    (slot) => {
      expect(recipe.base?.[slot]).toMatchObject({
        "&[data-span-end]": { "tbody:has(+ tfoot) > tr > &": { [RULE_WIDTH]: "0" } },
      });
    },
  );

  it.each(["cell", "rowHeader"] as const)(
    "aligns a Code chip in a %s to the bottom of the cell's text",
    (slot) => {
      expect(recipe.base?.[slot]).toMatchObject({ "& .code": { verticalAlign: "text-bottom" } });
    },
  );

  it("selects the Code chip by the class typography's code recipe writes", () => {
    expect(typography.theme?.extend?.recipes?.["code"]?.className).toBe("code");
  });

  it.each(["cell", "rowHeader"] as const)("gives the %s slot a grid cell's styles", (slot) => {
    expect(recipe.base?.[slot]).toMatchObject(GRIDDED);
  });

  it("gives the editor slots the editor's and the refused reason's styles", () => {
    expect([recipe.base?.["editor"], recipe.base?.["editorError"]]).toStrictEqual([
      EDITOR,
      EDITOR_ERROR,
    ]);
  });

  it("hides a cell's content under its open editor", () => {
    expect(recipe.base?.["covered"]).toStrictEqual({ visibility: "hidden" });
  });

  it("lays a toggle's box out as a block-level flex box", () => {
    expect(recipe.base?.["toggle"]).toMatchObject({ display: "flex" });
  });

  it("centres a checkbox in a select box one line tall", () => {
    expect(recipe.base?.["selectBox"]).toStrictEqual({
      alignItems: "center",
      blockSize: "1lh",
      display: "flex",
    });
  });
});
