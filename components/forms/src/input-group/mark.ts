/**
 * Renders a mark inside the input group.
 *
 * @remarks
 *   A mark sits in the row at its own width, before, between or after the fields: an icon, a unit,
 *   a separator, a counter, a keyboard hint or a button. It sizes an `svg` to 1.25 times the
 *   group's text and sets figures in tabular numerals. A press on the mark itself focuses the
 *   nearest field. A decorative mark takes `aria-hidden`. A mark that contains a button does not.
 */

import { type ComponentProps } from "react";

import { withContext } from "#input-group/context.ts";

/**
 * Renders a `span` with the group's mark class.
 */
export const Mark = withContext("span", "mark");

/**
 * Describes the props of a mark: the props of a `span` element.
 */
export type MarkProps = ComponentProps<typeof Mark>;
