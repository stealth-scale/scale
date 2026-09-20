/**
 * Draws the mark that says a row is on.
 *
 * @remarks
 *   The row above hands down what the machine needs to read its state, so this takes no props of
 *   its own. It sits at the end of the row wherever a caller writes it, because the recipe orders
 *   it last, and keeps its box whether or not the row is on: the
 *   machine asks for it to be hidden when the row is off, and that is turned into invisibility
 *   rather than absence, so a panel is the same width whichever rows are on and no row steps
 *   sideways as its mark comes and goes. A caller draws whatever artwork they like inside it.
 *   It is hidden from assistive technology, because the row already reports whether it is on
 *   through `aria-checked` and the mark would otherwise be read out as part of the row's name. A
 *   caller who draws something here that carries meaning of its own says so.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu, useMenuItem } from "#menu/machine.ts";

/**
 * Draws the mark at the size the root states.
 */
const Marked = withContext("span", "itemIndicator");

/**
 * Describes what the mark takes.
 */
export type ItemIndicatorProps = ComponentProps<typeof Marked>;

/**
 * Says the row is on.
 *
 * @param props - Everything a styled span takes.
 * @returns The mark, carrying the row's state.
 */
export function ItemIndicator(props: ItemIndicatorProps): ReactElement {
  const { api } = useMenu();
  const item = useMenuItem();
  const { hidden: _hidden, ...shown } = api.getItemIndicatorProps(item);

  return <Marked {...mergeProps({ "aria-hidden": true }, shown, props)} />;
}
