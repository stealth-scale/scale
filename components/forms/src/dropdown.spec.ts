import { describe, expect, it } from "vitest";

import {
  aligned,
  content,
  control,
  flushed,
  glyph,
  indicatorEnd,
  inset,
  INSET,
  item,
  itemDescription,
  itemDescriptionSizes,
  itemGroup,
  itemGroupLabel,
  itemGroupLabelSizes,
  itemIndicator,
  itemIndicatorSizes,
  itemLines,
  itemSizes,
  itemText,
  label,
  labelSizes,
  padded,
  root,
  rootSizes,
  rows,
  rowsSizes,
  SIZES,
  viewport,
  viewportSizes,
} from "#dropdown.ts";

describe("dropdown", () => {
  it("offers the sizes sm md and lg", () => {
    expect(SIZES).toStrictEqual(["sm", "md", "lg"]);
  });

  it("names the flushed inset --dropdown-inset", () => {
    expect(INSET).toBe("--dropdown-inset");
  });

  it("returns the inset one size smaller than a button's", () => {
    expect(inset("md")).toBe("var(--dropdown-inset, calc({spacing.inset.sm} * var(--density, 1)))");
  });

  it("returns the icon one size smaller than the field as the glyph", () => {
    expect(glyph("lg")).toBe("calc({sizes.icon.md} * var(--density, 1))");
  });

  it("places the indicator at the inset inside the field's edge", () => {
    expect(indicatorEnd("md")).toBe(`calc(${inset("md")} + {borderWidths.control})`);
  });

  it("returns the gap one size smaller as the panel's padding", () => {
    expect(padded("md")).toBe("calc({spacing.gap.sm} * var(--density, 1))");
  });

  it("returns the field's inset less the panel's padding as a row's inline padding", () => {
    expect(aligned("md")).toBe(`calc(${inset("md")} - ${padded("md")})`);
  });

  it("stacks the root's label above its control", () => {
    expect(root()).toStrictEqual({
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      minInlineSize: "0",
    });
  });

  it("separates the label from the control by the gap one size smaller", () => {
    expect(rootSizes().md).toStrictEqual({ rowGap: "calc({spacing.gap.sm} * var(--density, 1))" });
  });

  it("dims a disabled label", () => {
    expect(label()).toMatchObject({ _disabled: { layerStyle: "disabled" } });
  });

  it("sets the label in the label role of its size", () => {
    expect(labelSizes().lg).toStrictEqual({ textStyle: "label.lg" });
  });

  it("places the control's triggers against the control", () => {
    expect(control()).toMatchObject({ position: "relative" });
  });

  it("caps the panel at 24rem and the room the window leaves", () => {
    expect(content()).toMatchObject({
      maxBlockSize: "min({sizes.sm}, var(--available-height, {sizes.sm}))",
    });
  });

  it("leaves the scrolling to the rows' scroll area", () => {
    expect(content()).not.toHaveProperty("overflowY");
  });

  it("hides the focus ring of the rows' scroll area", () => {
    expect(content()).toMatchObject({ "--scroll-area-ring-style": "none" });
  });

  it("rests the panel on the popover surface", () => {
    expect(content()).toMatchObject({ background: "bg.popover", boxShadow: "md" });
  });

  it("stops the viewport's scroll at the panel's ends", () => {
    expect(viewport()).toStrictEqual({ overscrollBehavior: "contain" });
  });

  it("keeps a revealed row the panel's padding from the viewport's edge", () => {
    expect(viewportSizes().sm).toStrictEqual({ scrollPadding: padded("sm") });
  });

  it("stacks the rows in a column", () => {
    expect(rows()).toStrictEqual({ display: "flex", flexDirection: "column" });
  });

  it("pads the rows by the panel's padding", () => {
    expect(rowsSizes().lg).toStrictEqual({ padding: padded("lg") });
  });

  it("puts a row's check at its end", () => {
    expect(item()).toMatchObject({ justifyContent: "space-between" });
  });

  it("returns a row's padding gap and text one size smaller than the dropdown", () => {
    expect(itemSizes().md).toStrictEqual({
      "& > svg": { boxSize: glyph("md"), flexShrink: "0" },
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: aligned("md"),
      textStyle: "body.sm",
    });
  });

  it("truncates a row's text to one line", () => {
    expect(itemText()).toMatchObject({ flex: "1", minInlineSize: "0", whiteSpace: "nowrap" });
  });

  it("stacks a row's text above its description", () => {
    expect(itemLines()).toMatchObject({ flexDirection: "column" });
  });

  it("inks a description in the tertiary color", () => {
    expect(itemDescription()).toMatchObject({ color: "fg.subtle", display: "block" });
  });

  it("sets a description two sizes smaller than the dropdown", () => {
    expect(itemDescriptionSizes().lg).toStrictEqual({ textStyle: "body.sm" });
  });

  it("stacks a group's label above its rows", () => {
    expect(itemGroup()).toStrictEqual({ display: "flex", flexDirection: "column" });
  });

  it("inks a group's label in the tertiary color", () => {
    expect(itemGroupLabel()).toStrictEqual({ color: "fg.subtle", fontWeight: "medium" });
  });

  it("pads a group's label on the rows' line", () => {
    expect(itemGroupLabelSizes().md).toStrictEqual({
      paddingBlock: "calc({spacing.gap.xs} * var(--density, 1))",
      paddingInline: aligned("md"),
      textStyle: "body.xs",
    });
  });

  it("keeps the check's column on an unselected row", () => {
    expect(itemIndicator()).toMatchObject({
      "&[data-state=checked]": { visibility: "visible" },
      boxSizing: "content-box",
      visibility: "hidden",
    });
  });

  it("sizes the check to the indicator's glyph after the row's gap", () => {
    expect(itemIndicatorSizes().sm).toStrictEqual({
      boxSize: glyph("sm"),
      paddingInlineStart: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("keeps the smallest inset on the flushed look", () => {
    expect(flushed()).toStrictEqual({
      "--dropdown-inset": "calc({spacing.inset.xs} * var(--density, 1))",
    });
  });
});
