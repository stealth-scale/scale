/**
 * Renders the mark at the select's end, which the caller passes as its children.
 *
 * @remarks
 *   The indicator follows the field, so it dims with a disabled field and takes the error ink
 *   with an invalid one. It is hidden from screen readers, because the select states its own role.
 */

import { type ComponentProps } from "react";

import { withContext } from "#native-select/context.ts";

/**
 * Renders the indicator `span`, hidden from screen readers.
 */
export const Indicator = withContext("span", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of `Indicator`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
