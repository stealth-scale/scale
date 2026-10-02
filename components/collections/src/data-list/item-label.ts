/**
 * Renders the label of a pair, the term that names the value.
 */

import { type ComponentProps } from "react";

import { withContext } from "#data-list/context.ts";

/**
 * Renders the label `dt`, a row that places a mark or a control beside the words.
 */
export const ItemLabel = withContext("dt", "itemLabel");

/**
 * Describes the props of `ItemLabel`.
 */
export type ItemLabelProps = ComponentProps<typeof ItemLabel>;
