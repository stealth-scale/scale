/**
 * Renders the column that contains a row's text and its description.
 *
 * @remarks
 *   The column keeps the text and the description together, and the row centres the check on it.
 *   The element has no role and no machine props.
 */

import { type ComponentProps } from "react";

import { withContext } from "#combobox/context.ts";

/**
 * Renders the `span` with the combobox's item lines class.
 */
export const ItemLines = withContext("span", "itemLines");

/**
 * Describes the props of a row's lines: the props of a `span`.
 */
export type ItemLinesProps = ComponentProps<typeof ItemLines>;
