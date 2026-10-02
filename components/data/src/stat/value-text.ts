/**
 * Renders the stat's figure.
 *
 * @remarks
 *   The figure is a `dd` that contains whatever formats the number, and a `ValueUnit` after it.
 *   The component formats nothing.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stat/context.ts";

/**
 * Renders the figure `dd`.
 */
export const ValueText = withContext("dd", "valueText");

/**
 * Describes the props of `ValueText`.
 */
export type ValueTextProps = ComponentProps<typeof ValueText>;
