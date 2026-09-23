/**
 * Renders the status's dot.
 *
 * @remarks
 *   The dot is decorative, so `aria-hidden` defaults to `true`. The word beside it is what a screen
 *   reader announces.
 */

import { type ComponentProps } from "react";

import { withContext } from "#status/context.ts";

/**
 * Renders the dot `span`, hidden from assistive technology.
 */
export const Indicator = withContext("span", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of `Indicator`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
