/**
 * Renders the icon at the end of the control that marks the menu.
 *
 * @remarks
 *   The indicator is the menu's `Menu.Indicator` bound to a slot of the switcher, so it reports the
 *   menu's state in `data-state`. The recipe keeps it still while the menu is open. Screen readers
 *   do not announce it, because the control's `aria-expanded` reports the state.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Renders the menu's indicator with the indicator slot's class.
 */
export const Indicator = withContext(Menu.Indicator, "indicator");

/**
 * Describes the props of `Indicator`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
