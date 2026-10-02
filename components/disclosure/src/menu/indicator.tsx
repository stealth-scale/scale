/**
 * Renders the mark at the end of a trigger or a trigger row.
 *
 * @remarks
 *   The element is a `span`, because a button accepts phrasing content alone. The indicator sets
 *   `aria-hidden`, because the trigger reports its state with `aria-expanded` and a mark inside a
 *   button joins the button's name. A caller whose mark adds information sets
 *   `aria-hidden={false}`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `span` with the menu's indicator class.
 */
const Marked = withContext("span", "indicator");

/**
 * Describes the props of the indicator: the props of a `span`.
 */
export type IndicatorProps = ComponentProps<typeof Marked>;

/**
 * Renders the indicator, hidden from assistive technology, with the machine's indicator props.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const { api } = useMenu();

  return <Marked {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
