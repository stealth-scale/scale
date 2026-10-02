/**
 * Renders the column that contains a row's text and its description.
 *
 * @remarks
 *   The column keeps the text and the description together, and the row centres the marks on it.
 *   The element has no role and no machine props.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Renders the `span` with the listbox's item lines class.
 */
export const ItemLines = withContext("span", "itemLines");

/**
 * Describes the props of a row's lines: the props of a `span`.
 */
export type ItemLinesProps = ComponentProps<typeof ItemLines>;
