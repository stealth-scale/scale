/**
 * Renders the description under one row's text.
 *
 * @remarks
 *   The description renders on its own line under the row's text, and a screen reader reads it as
 *   part of the row's name. The element has no machine props.
 */

import { type ComponentProps } from "react";

import { withContext } from "#select/context.ts";

/**
 * Renders the `span` with the select's item description class, in the tertiary ink and two sizes
 * smaller than the select.
 */
export const ItemDescription = withContext("span", "itemDescription");

/**
 * Describes the props of a row's description: the props of a `span`.
 */
export type ItemDescriptionProps = ComponentProps<typeof ItemDescription>;
