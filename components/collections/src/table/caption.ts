/**
 * Renders the table's caption.
 *
 * @remarks
 *   The element is a `caption`, the table's accessible name. It renders below the table. Give it an
 *   `id` and point the scroller's `aria-labelledby` at it, so the scroller takes the same name.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `caption` with the table's caption class.
 */
export const Caption = withContext("caption", "caption");

/**
 * Describes the props of the caption: the props of a `caption`.
 */
export type CaptionProps = ComponentProps<typeof Caption>;
