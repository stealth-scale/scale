/**
 * Renders the description under one row's text.
 *
 * @remarks
 *   The description renders on its own line under the row's text. The element has no machine
 *   props. A caller whose description adds information the text lacks points the row's
 *   `aria-describedby` at it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Renders the `span` with the listbox's item description class, in the tertiary ink and one size
 * smaller than the row's text.
 */
export const ItemDescription = withContext("span", "itemDescription");

/**
 * Describes the props of a row's description: the props of a `span`.
 */
export type ItemDescriptionProps = ComponentProps<typeof ItemDescription>;
