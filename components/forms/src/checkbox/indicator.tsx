/**
 * Renders a mark inside the box, for the checked or the partly-on state.
 *
 * @remarks
 *   A checkbox has three states and two of them show a mark, so each indicator states which one it
 *   belongs to. An indicator without `indeterminate` shows while the box is checked, and one with
 *   it shows while the box is partly on. A box that never goes partly on needs one indicator. The
 *   mark is decorative: the root's `input` reports the state.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Renders the `span` with the checkbox's indicator class.
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
 * Renders the mark while the box is in the indicator's state, and hides it otherwise.
 *
 * @param props - The state the mark belongs to, and attributes and children of the `span`.
 * @returns The `span` element, hidden outside its state.
 */
export function Indicator({ indeterminate = false, ...rest }: IndicatorProps): ReactElement {
  const api = useCheckbox();
  const shown = indeterminate ? api.indeterminate : api.checked && !api.indeterminate;

  return <Marked {...mergeProps(api.getIndicatorProps(), rest)} hidden={!shown} />;
}
