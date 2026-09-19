/**
 * Draws the mark on the control that says whether the menu is open.
 *
 * @remarks
 *   The machine writes the open state onto it and the recipe turns it half a revolution, so a
 *   caller draws whatever artwork they like inside and the turn follows the menu.
 *   It states `aria-hidden`, because it sits inside the control and everything inside a control is
 *   read as part of that control's name. A chevron drawn here would otherwise be announced after
 *   the words the control was named with, and the control already carries `aria-expanded`. A caller
 *   whose mark says something the name does not can state `aria-hidden={false}`.
 *   The element is `span`, because it sits inside the control and a button holds phrasing content
 *   alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Draws the mark at the size the root states.
 */
const Marked = withContext("span", "indicator");

/**
 * Describes what the mark takes.
 */
export type IndicatorProps = ComponentProps<typeof Marked>;

/**
 * Says whether the menu is open.
 *
 * @param props - Everything a styled span takes.
 * @returns The mark, carrying the open state.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const { api } = useMenu();

  return <Marked {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
