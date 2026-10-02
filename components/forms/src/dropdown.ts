/**
 * Styles a field that opens a panel of rows under it, which the select and the combobox render
 * alike.
 *
 * @remarks
 *   Each function returns the styles of one part, or a length the parts are placed by, and each
 *   recipe places them on its own slots. The select's panel and rows match the combobox's, and the
 *   fields differ. The panel is as wide as the field and starts under it. A row pads by the field's
 *   inset less the panel's padding, so a row's text starts on the line the field's value starts on,
 *   and the check at a row's end ends on the line the field's indicator ends on. The panel takes a
 *   menu's surface look, at most 24rem tall and never taller than the room the window leaves. The
 *   rows scroll in the primitives package's scroll area inside the panel: the recipes' `viewport`
 *   and `rows` slots are its viewport, the element with the listbox role, and its content.
 */

import {
  below,
  dense,
  motion,
  row,
  sizeVariants,
  type SystemStyleObject,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Sizes a dropdown is offered at, the sizes a field and a fieldset pass down.
 */
export const SIZES = ["sm", "md", "lg"] as const;

/**
 * Size of a dropdown.
 */
export type Size = (typeof SIZES)[number];

/**
 * Custom property the flushed look sets to the smallest inset, which the field's insets and the
 * places of its indicator and clear trigger read over the size's own.
 */
export const INSET = "--dropdown-inset";

/**
 * Custom property the scroll area's root reads for the style of its focus ring.
 */
const RING_STYLE = "--scroll-area-ring-style";

/**
 * Returns the field's inline inset at a size: the flushed look's where it sets one, else one size
 * smaller than a button's, the inset an input of the same size starts its text at.
 */
export function inset(size: Size): string {
  return `var(${INSET}, ${dense(`{spacing.inset.${below(size)}}`)})`;
}

/**
 * Returns the side of the indicator's glyph at a size: the icon one size smaller than the field.
 */
export function glyph(size: Size): string {
  return dense(`{sizes.icon.${below(size)}}`);
}

/**
 * Returns the distance from the control's end at which the indicator's glyph ends: the inset and
 * the field's edge.
 *
 * @remarks
 *   The glyph then ends as far from the field's end as the value starts from its start, and on the
 *   line the check of an open row ends on.
 */
export function indicatorEnd(size: Size): string {
  return `calc(${inset(size)} + {borderWidths.control})`;
}

/**
 * Returns the panel's padding at a size: the gap one size smaller.
 */
export function padded(size: Size): string {
  return dense(`{spacing.gap.${below(size)}}`);
}

/**
 * Returns the inline padding of a row and a group label at a size: the field's inset less the
 * panel's padding.
 *
 * @remarks
 *   A caller portals the panel out of the root, so the flushed look sets the inset on the panel as
 *   well as on the root.
 */
export function aligned(size: Size): string {
  return `calc(${inset(size)} - ${padded(size)})`;
}

/**
 * Returns the root's styles: a column of the label and the control, as wide as its container.
 */
export function root(): SystemStyleObject {
  return { display: "flex", flexDirection: "column", inlineSize: "full", minInlineSize: "0" };
}

/**
 * Returns the root's size axis: the gap between the label and the control, one size smaller.
 */
export function rootSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ rowGap: dense(`{spacing.gap.${below(size)}}`) }), SIZES);
}

/**
 * Returns the label's styles: the medium weight, dimmed while disabled.
 */
export function label(): SystemStyleObject {
  return { _disabled: { layerStyle: "disabled" }, color: "fg", fontWeight: "medium" };
}

/**
 * Returns the label's size axis: the label role at the dropdown's size.
 */
export function labelSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES);
}

/**
 * Returns the control's styles: the box the indicator and the clear trigger are placed against.
 */
export function control(): SystemStyleObject {
  return { display: "flex", inlineSize: "full", minInlineSize: "0", position: "relative" };
}

/**
 * Returns the panel's styles: a menu's surface, a column the rows' scroll area fills, no focus
 * ring on the panel or its scroll area, and the slide and fade of its entry and exit.
 */
export function content(): SystemStyleObject {
  return {
    ...motion("slide-fade.in", "slide-fade.out"),
    background: "bg.popover",
    borderColor: "border",
    borderRadius: "l2",
    borderStyle: "solid",
    borderWidth: "hairline",
    boxShadow: "md",
    color: "fg",
    colorPalette: "neutral",
    display: "flex",
    flexDirection: "column",
    maxBlockSize: "min({sizes.sm}, var(--available-height, {sizes.sm}))",
    minInlineSize: "44",
    outline: "0",
    [RING_STYLE]: "none",
    zIndex: "dropdown",
  };
}

/**
 * Returns the styles of the scroll area's viewport: a scroll that stops at the panel's ends.
 */
export function viewport(): SystemStyleObject {
  return { overscrollBehavior: "contain" };
}

/**
 * Returns the viewport's size axis: the rows' padding as scroll padding, so a revealed row keeps
 * clear of the edge by it.
 */
export function viewportSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ scrollPadding: padded(size) }), SIZES);
}

/**
 * Returns the styles of the scroll area's content: a column of the rows.
 */
export function rows(): SystemStyleObject {
  return { display: "flex", flexDirection: "column" };
}

/**
 * Returns the rows' size axis: the panel's padding, the gap one size smaller.
 */
export function rowsSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ padding: padded(size) }), SIZES);
}

/**
 * Returns a row's styles: a row of its lines and its check, the check at the end.
 */
export function item(): SystemStyleObject {
  return { ...row(), justifyContent: "space-between" };
}

/**
 * Returns a row's size axis: its padding, its gap, a leading icon and the body role one size
 * smaller than the dropdown.
 */
export function itemSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants(
    (size) => ({
      "& > svg": { boxSize: glyph(size), flexShrink: "0" },
      gap: dense(`{spacing.gap.${size}}`),
      paddingBlock: dense(`{spacing.gap.${below(size)}}`),
      paddingInline: aligned(size),
      textStyle: `body.${below(size)}`,
    }),
    SIZES,
  );
}

/**
 * Returns the styles of a row's text: one line that truncates.
 */
export function itemText(): SystemStyleObject {
  return { ...truncate(), flex: "1", minInlineSize: "0", textAlign: "start" };
}

/**
 * Returns the styles of a row's lines, which stack its text above its description.
 */
export function itemLines(): SystemStyleObject {
  return { display: "flex", flex: "1", flexDirection: "column", minInlineSize: "0" };
}

/**
 * Returns the styles of a row's description: one line in the tertiary ink.
 */
export function itemDescription(): SystemStyleObject {
  return { ...truncate(), color: "fg.subtle", display: "block", textAlign: "start" };
}

/**
 * Returns the description's size axis: the body role two sizes smaller than the dropdown.
 */
export function itemDescriptionSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ textStyle: `body.${below(below(size))}` }), SIZES);
}

/**
 * Returns the styles of a group, which stack its label above its rows.
 */
export function itemGroup(): SystemStyleObject {
  return { display: "flex", flexDirection: "column" };
}

/**
 * Returns the styles of a group's label: the medium weight in the tertiary ink.
 */
export function itemGroupLabel(): SystemStyleObject {
  return { color: "fg.subtle", fontWeight: "medium" };
}

/**
 * Returns the group label's size axis: the body role two sizes smaller, padded as a row.
 */
export function itemGroupLabelSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants(
    (size) => ({
      paddingBlock: dense(`{spacing.gap.${below(below(size))}}`),
      paddingInline: aligned(size),
      textStyle: `body.${below(below(size))}`,
    }),
    SIZES,
  );
}

/**
 * Returns the styles of a row's check: the glyph at the row's end, hidden until the row is
 * selected.
 *
 * @remarks
 *   The check keeps its box while hidden, so every row keeps the check's column and the rows' text
 *   ends on one line. The box sizes its content, so the padding before the check leaves the glyph
 *   at its full side.
 */
export function itemIndicator(): SystemStyleObject {
  return {
    "&[data-state=checked]": { visibility: "visible" },
    "& > svg": { boxSize: "100%" },
    alignItems: "center",
    boxSizing: "content-box",
    display: "inline-flex",
    flexShrink: "0",
    justifyContent: "center",
    marginInlineStart: "auto",
    visibility: "hidden",
  };
}

/**
 * Returns the check's size axis: the indicator's glyph, and the row's gap before it.
 */
export function itemIndicatorSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants(
    (size) => ({ boxSize: glyph(size), paddingInlineStart: dense(`{spacing.gap.${size}}`) }),
    SIZES,
  );
}

/**
 * Returns the styles of the root and the panel on the flushed look: the smallest inset at every
 * size.
 *
 * @remarks
 *   The value then starts near the start of the field's edge and the indicator ends near its end,
 *   as on the flushed input, and the rows' text and checks follow them.
 */
export function flushed(): SystemStyleObject {
  return { [INSET]: dense("{spacing.inset.xs}") };
}
