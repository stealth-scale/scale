/**
 * Renders the button that sorts a column, inside its header.
 *
 * @remarks
 *   The element is a `button` inside the `th`, the pattern the WAI-ARIA practices give for a
 *   sortable column. The header states `aria-sort`. The button reports the press, and sorting is
 *   the caller's.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `button` with the table's sorter class and `type="button"`.
 */
export const Sorter = withContext("button", "sorter", { defaultProps: { type: "button" } });

/**
 * Describes the props of the sorter: the props of a `button`.
 */
export type SorterProps = ComponentProps<typeof Sorter>;
