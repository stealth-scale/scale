/**
 * Writes the axes a recipe offers for how a thing is filled, how a field's edge is drawn, and the
 * way it marks a highlighted row, each a layer style the theme owns.
 *
 * @remarks
 *   A recipe that offers six looks would otherwise write six fills, six inks and six hovers by
 *   hand. Each look here is one layer style, so a theme that changes how a solid control is drawn
 *   changes it for every recipe that offers the look.
 */

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
 * Writes the `variant` axis for the looks given, each reading its layer style.
 *
 * @typeParam Offered - The looks the recipe offers, which is every one unless it names them.
 */
export function lookVariants(): Record<Look, SystemStyleObject>;

/**
 * Writes the `variant` axis for the looks a recipe names.
 *
 * @typeParam Offered - The looks the recipe offers.
 */
export function lookVariants<const Offered extends Look>(
  looks: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per look, each reading the layer style that draws it.
 */
export function lookVariants(looks: readonly Look[] = LOOKS): Record<string, SystemStyleObject> {
  return recordOf(looks, (look) => ({ layerStyle: LAYER_STYLES[look] }));
}

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
 * @typeParam Offered - The looks the recipe offers, which is every one unless it names them.
 */
export function flatVariants(): Record<Flat, SystemStyleObject>;

/**
 * Writes the `variant` axis for the flat looks a recipe names.
 *
 * @typeParam Offered - The looks the recipe offers.
 */
export function flatVariants<const Offered extends Flat>(
  looks: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per look, each reading the flat layer style of its name.
 */
export function flatVariants(looks: readonly Flat[] = FLATS): Record<string, SystemStyleObject> {
  return recordOf(looks, (look) => ({ layerStyle: `flat.${look}` }));
}

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
 * @typeParam Offered - The looks the recipe offers, which is every one unless it names them.
 */
export function fieldVariants(): Record<Field, SystemStyleObject>;

/**
 * Writes the `variant` axis for the field looks a recipe names.
 *
 * @typeParam Offered - The looks the recipe offers.
 */
export function fieldVariants<const Offered extends Field>(
  looks: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per look, each reading the field layer style of its name.
 */
export function fieldVariants(looks: readonly Field[] = FIELDS): Record<string, SystemStyleObject> {
  return recordOf(looks, (look) => ({ layerStyle: `field.${look}` }));
}

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
    const marked =
      highlight === "bar"
        ? { background: "colorPalette.muted", layerStyle: MARKS[highlight] }
        : { layerStyle: MARKS[highlight] };

    return when === "_currentPage" ? { _currentPage: marked } : { _highlighted: marked };
  });
}
