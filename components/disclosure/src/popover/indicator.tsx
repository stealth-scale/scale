/**
 * Renders the mark inside the trigger that turns half a revolution while the popover is open.
 *
 * @remarks
 *   The indicator sets `aria-hidden`, because the trigger reports its state with `aria-expanded`
 *   and a mark inside a button joins the button's name. A caller whose mark adds information sets
 *   `aria-hidden={false}`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `span` with the popover's indicator class.
 */
const Drawn = withContext("span", "indicator");

/**
 * Describes the props of the indicator: the props of a `span`.
 */
export type IndicatorProps = ComponentProps<typeof Drawn>;

/**
 * Renders the indicator, hidden from assistive technology, with the machine's indicator props.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
