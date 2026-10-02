/**
 * Renders words that only assistive technology reads, such as the name of a column whose cells
 * contain buttons.
 */

import { type ComponentProps } from "react";

import { withContext } from "#data-table/context.ts";

/**
 * Renders a `span` with the recipe's visually hidden class.
 */
export const HiddenText = withContext("span", "visuallyHidden");

/**
 * Describes the props of the hidden words: the props of a `span`.
 */
export type HiddenTextProps = ComponentProps<typeof HiddenText>;
