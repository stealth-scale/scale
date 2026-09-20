/**
 * Writes the axes a recipe offers for how a thing is filled, how a field's edge is drawn, and the
 * way it marks a highlighted row, each a layer style the theme owns.
 *
 * @remarks
 *   A recipe that offers six looks would otherwise write six fills, six inks and six hovers by
 *   hand. Each look here is one layer style, so a theme that changes how a solid control is drawn
 *   changes it for every recipe that offers the look.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";

/**
 * Selects one of the looks a control can be drawn in.
 */
export type Look = "ghost" | "outline" | "plain" | "solid" | "subtle" | "surface";

/**
 * Lists every look a control can be drawn in, in the order a documentation page shows them.
 */
export const LOOKS: readonly Look[] = ["solid", "subtle", "surface", "outline", "ghost", "plain"];

/**
 * Maps each look to the layer style that draws it.
 */
const LAYER_STYLES: Readonly<Record<Look, string>> = {
  ghost: "fill.ghost",
  outline: "outline.solid",
  plain: "fill.plain",
  solid: "fill.solid",
  subtle: "fill.subtle",
  surface: "fill.surface",
};

/**
 * Writes the `variant` axis of a control, each look reading the layer style that draws it.
 */
export const lookVariants: Axis<Look> = axis(LOOKS, (look) => ({ layerStyle: LAYER_STYLES[look] }));

/**
 * Selects one of the looks a thing that is read rather than pressed can be drawn in.
 */
export type Flat = "outline" | "plain" | "solid" | "subtle" | "surface";

/**
 * Lists every flat look, in the order a documentation page shows them.
 *
 * @remarks
 *   Ghost is not among them. A ghost control is a transparent box that fills in under a pointer,
 *   and a look that never repaints leaves it identical to plain.
 */
export const FLATS: readonly Flat[] = ["solid", "subtle", "surface", "outline", "plain"];

/**
 * Writes the `variant` axis of a thing that holds still, each look one layer style.
 *
 * @remarks
 *   A badge, a tag or a chip reads as part of what it labels. Drawn in a fill it would repaint
 *   under a pointer, which reads as something to press, so it reads a flat look instead.
 */
export const flatVariants: Axis<Flat> = axis(FLATS, (look) => ({ layerStyle: `flat.${look}` }));

/**
 * Selects one of the ways the edge of a form field is drawn.
 */
export type Field = "flushed" | "outline" | "subtle";

/**
 * Lists every field look, in the order a documentation page shows them.
 */
export const FIELDS: readonly Field[] = ["outline", "subtle", "flushed"];

/**
 * Writes the `variant` axis of a form field, each look one layer style.
 *
 * @remarks
 *   A field is drawn from a surface and an edge rather than from a fill, because the ink inside it
 *   is the reader's own and a fill that repaints under a pointer reads as something to press. The
 *   flushed look keeps its bottom edge alone. It drops the inset with it, which the recipe states,
 *   because a layer style carries no padding.
 */
export const fieldVariants: Axis<Field> = axis(FIELDS, (look) => ({ layerStyle: `field.${look}` }));

/**
 * Writes the `variant` axis of a field whose surface is a box around the control.
 *
 * @remarks
 *   The same three looks, read through the control the box holds. A look written for the control
 *   itself carries `_readOnly`, and `:read-only` matches every element that is not editable, so an
 *   outlined textarea rested on the read-only fill whatever its control was doing.
 */
export const wrappedFieldVariants: Axis<Field> = axis(FIELDS, (look) => ({
  layerStyle: `field.wrapped.${look}`,
}));

/**
 * Selects how the row a list has moved its highlight onto is marked.
 */
export type Highlight = "bar" | "fill" | "tint";

/**
 * Lists the highlights in the order a documentation page shows them, quietest first.
 */
export const HIGHLIGHTS: readonly Highlight[] = ["tint", "fill", "bar"];

/**
 * Maps each highlight to the layer style that draws it.
 *
 * @remarks
 *   The tint is the muted fill rather than the subtle one, because a list is as often drawn on a
 *   subtle surface as on the page, and a subtle mark on a subtle surface marks nothing.
 */
const MARKS: Readonly<Record<Highlight, string>> = {
  bar: "indicator.start",
  fill: "fill.solid",
  tint: "fill.muted",
};

/**
 * Selects the state a row is marked in: the one a list has moved its highlight onto, or the one
 * naming the page a reader is on.
 */
export type Marked = "_currentPage" | "_highlighted";

/**
 * Writes the line that finds the marked row where the display has replaced every fill.
 *
 * @remarks
 *   A forced-color mode paints every background from one system palette, so a tint and a solid
 *   both land on the same colour as the rows around them and the marked row disappears. The line
 *   is geometry rather than color, which such a mode keeps, and it is drawn inside the row's own
 *   box so it does not move the list. `Highlight` is the system color a chosen thing is marked in,
 *   which is what a reader of that mode already reads a selection by.
 */
const FOUND: SystemStyleObject = {
  _highContrast: {
    outlineColor: "Highlight",
    outlineOffset: "calc({borderWidths.indicator} * -1)",
    outlineStyle: "solid",
    outlineWidth: "indicator",
  },
};

/**
 * Writes the `highlight` axis of a list: how the one row the reader is on is marked.
 *
 * @remarks
 *   A menu, a select and a combobox all move one highlight over their rows, and each of them marks
 *   it in the same three ways. The styles sit under the marked condition rather than on the
 *   row, because the row is drawn plain until the list reaches it. The bar draws a line down the
 *   leading edge and tints the row behind it, so the row the reader is on is marked twice over and
 *   a reader who cannot separate the two colors still has the line.
 * @typeParam Offered - The highlights the recipe offers, which is every one unless it names them.
 */
export function highlightVariants(): Record<Highlight, SystemStyleObject>;

/**
 * Writes the `highlight` axis for the marks a recipe names.
 *
 * @typeParam Offered - The highlights the recipe offers.
 */
export function highlightVariants<const Offered extends Highlight>(
  highlights: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes the `highlight` axis for a list that marks the page a reader is on rather than a row it
 * has moved a highlight onto.
 *
 * @remarks
 *   A navigation list marks a destination the reader has already arrived at, which the browser
 *   states as `aria-current`, and it marks it in the same three ways a menu marks a highlight. The
 *   condition is the only thing that differs, so the marks stay in one place and a theme that
 *   restates how a highlighted row is drawn reaches both.
 * @typeParam Offered - The highlights the recipe offers.
 */
export function highlightVariants<const Offered extends Highlight>(
  highlights: readonly Offered[],
  when: Marked,
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per highlight, each reading its layer style under the condition given.
 */
export function highlightVariants(
  highlights: readonly Highlight[] = HIGHLIGHTS,
  when: Marked = "_highlighted",
): Record<string, SystemStyleObject> {
  return recordOf(highlights, (highlight): SystemStyleObject => {
    const marked = {
      ...FOUND,
      ...(highlight === "bar" ? { background: "colorPalette.muted" } : {}),
      layerStyle: MARKS[highlight],
    };

    return when === "_currentPage" ? { _currentPage: marked } : { _highlighted: marked };
  });
}
