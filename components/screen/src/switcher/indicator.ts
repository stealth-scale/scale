/**
 * Draws the mark saying there is a list behind the control.
 *
 * @remarks
 *   The menu's own indicator drawn under a slot of this recipe, so it reports the panel's state
 *   without this component tracking whether it is open, and the recipe holds it still.
 *   It says nothing a screen reader needs. The control already carries `aria-expanded`, so a reader
 *   is told once rather than twice.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the mark at the end of the control.
 */
export const Indicator = withContext(Menu.Indicator, "indicator");

/**
 * Describes what the mark takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
