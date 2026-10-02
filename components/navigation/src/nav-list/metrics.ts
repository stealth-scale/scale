/**
 * Computes the geometry the navigation list's size axis is written from.
 *
 * @remarks
 *   The module covers the row, its leading icon, the end column and the nested list's margin. It is
 *   a separate module so the recipe is under the 300-line limit.
 */

import { below, dense, type Scale, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Selects one of the three sizes a row offers.
 */
export type Step = "lg" | "md" | "sm";

/**
 * Maps each row size to the size token of its height: 24px, 32px and 40px at the foundation's
 * metrics.
 *
 * @remarks
 *   The `md` and `lg` rows read the control scale, so a sidebar's rows are as tall as its
 *   controls. The `sm` row reads the tag scale's `md` step, the WCAG 2.5.8 target size, for a
 *   dense list such as a catalogue's: with the 4px gap its rows are 28px apart.
 */
const ROW: Readonly<Record<Step, string>> = {
  lg: "control.md",
  md: "control.xs",
  sm: "tag.md",
};

/**
 * Returns the width and height of a row's leading icon, one size smaller than the row on the icon
 * scale.
 *
 * @param size - The row's size.
 * @returns The icon's width and height.
 */
export function glyph(size: Step): string {
  return dense(`{sizes.icon.${below(size)}}`);
}

/**
 * Returns the scale step a row's label, inset and gap read: two steps below the row, and never
 * below `xs`.
 *
 * @remarks
 *   A middle row reads `xs`: a 12.6px label, an 8px inset and a 4px gap in a 32px row. A large row
 *   reads `sm`, and a small row reads `xs` like a middle one.
 * @param size - The row's size.
 * @returns The step.
 */
export function lighter(size: Scale): Scale {
  return below(below(size));
}

/**
 * Returns the inline inset of a row: the space before its icon and after its end column.
 *
 * @param size - The row's size.
 * @returns The inset, multiplied by the density.
 */
export function inset(size: Scale): string {
  return dense(`{spacing.inset.${lighter(size)}}`);
}

/**
 * Returns the size styles of a link or a trigger.
 *
 * @remarks
 *   The label, the inset and the gap are two sizes smaller than the row, so a row is lighter than
 *   a button of the same height. The current row is semibold here and not in the base, because the
 *   label text style sets its own weight and the compiler emits variants after the base. The
 *   `highlight` axis sets the current row's ink, and the compiler emits `size` after `highlight`,
 *   so this function sets no ink. The row is at least `sizes.6` (24px) tall at any density, the
 *   WCAG 2.5.8 target size. The recipe sizes the icon, so the line down a nested list is aligned
 *   with the icon's centre.
 * @param size - The row's size.
 * @returns The styles of a link or a trigger at that size.
 */
export function rowed(size: Step): SystemStyleObject {
  return {
    _currentPage: { fontWeight: "semibold" },
    "& > svg": { boxSize: glyph(size), flexShrink: "0" },
    blockSize: `max({sizes.6}, ${dense(`{sizes.${ROW[size]}}`)})`,
    gap: dense(`{spacing.gap.${lighter(size)}}`),
    paddingInline: inset(size),
    textStyle: `label.${lighter(size)}`,
  };
}

/**
 * Returns the side of the end column's square: the tag size one step below the row, and never
 * under `sizes.6`.
 *
 * @remarks
 *   The control is positioned over the row's link, so the WCAG 2.5.8 spacing exception does not
 *   apply and the control needs a 24px target. The square is at least 24px at every size and
 *   density.
 */
function square(size: Scale): string {
  return `max({sizes.6}, ${dense(`{sizes.tag.${below(size)}}`)})`;
}

/**
 * Returns the styles that make the end column a square with its content centred.
 *
 * @remarks
 *   The count, the control and the indicator share this square, so their centres are at one
 *   distance from the row's end. The square sets a minimum width, so a three-digit count extends
 *   it towards the row's start.
 * @param size - The row's size.
 * @returns The styles of the count, the control or the indicator at that size.
 */
export function trailing(size: Scale): SystemStyleObject {
  return {
    alignItems: "center",
    blockSize: square(size),
    display: "flex",
    justifyContent: "center",
    minInlineSize: square(size),
  };
}

/**
 * Returns the space between the end column and the row's edge, equal to the row's inset at the
 * start.
 *
 * @param size - The row's size.
 * @returns The end margin of the count or the control.
 */
export function tucked(size: Scale): SystemStyleObject {
  return { marginInlineEnd: inset(size) };
}

/**
 * Returns the end padding a row keeps for a part positioned over it: the inset, the gap and the
 * square.
 *
 * @remarks
 *   The count and the control are positioned over the row, and the padding keeps the row's text
 *   clear of them.
 * @param size - The row's size.
 * @returns The row's end padding.
 */
export function reserved(size: Scale): string {
  return `calc(${inset(size)} + ${dense(`{spacing.gap.${lighter(size)}}`)} + ${square(size)})`;
}

/**
 * Returns the start margin that puts the line down a nested list on the centre of the trigger's
 * icon.
 *
 * @remarks
 *   The margin is the trigger's inset plus half the icon, less half the line. At the middle size
 *   the line is 16px from the list's start, on the centre of a 16px icon that starts at 8px. A
 *   trigger without a leading icon puts the line at its inset, under the start of its text.
 * @param size - The row's size.
 * @returns The nested list's start margin.
 */
export function centred(size: Step): string {
  return `calc(${inset(size)} + ${glyph(size)} / 2 - {borderWidths.hairline} / 2)`;
}
