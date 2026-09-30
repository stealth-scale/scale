/**
 * Renders a mark inside a checkbox card's box, for the checked or the partly-on state.
 *
 * @remarks
 *   An indicator without `indeterminate` shows while the card is checked, and one with it shows
 *   while the card is partly on, as the checkbox's indicator does. The mark is the caller's glyph
 *   and is decorative: the card's `input` reports the state.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox-card/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Renders the `span` with the checkbox card's indicator class.
 */
const Marked = withContext("span", "indicator");

/**
 * Describes the props of an indicator: the state it belongs to and the props of a `span`.
 */
export interface IndicatorProps extends Omit<ComponentProps<typeof Marked>, "hidden"> {
  /**
   * Whether the mark shows for the partly-on state instead of the checked state. Defaults to
   * false.
   */
  readonly indeterminate?: boolean | undefined;
}

/**
 * Renders the mark while the card is in the indicator's state, and hides it otherwise.
 *
 * @param props - The state the mark belongs to, and attributes and children of the `span`.
 * @returns The `span` element, hidden outside its state.
 */
export function Indicator({ indeterminate = false, ...rest }: IndicatorProps): ReactElement {
  const api = useCheckbox();
  const shown = indeterminate ? api.indeterminate : api.checked && !api.indeterminate;

  return <Marked {...mergeProps(api.getIndicatorProps(), rest)} hidden={!shown} />;
}
