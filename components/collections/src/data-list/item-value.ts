/**
 * Renders the value of a pair: words, or components such as a badge or a link.
 */

import { type ComponentProps } from "react";

import { withContext } from "#data-list/context.ts";

/**
 * Renders the value `dd`, a wrapping row with no indent.
 */
export const ItemValue = withContext("dd", "itemValue");

/**
 * Describes the props of `ItemValue`.
 */
export type ItemValueProps = ComponentProps<typeof ItemValue>;
