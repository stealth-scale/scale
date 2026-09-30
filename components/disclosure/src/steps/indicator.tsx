/**
 * Renders the disc that marks a step.
 *
 * @remarks
 *   The element is a `span`, hidden from assistive technology, because `Steps.Title` names the step
 *   and its state. Without children the disc shows the step's number, counted from one. A caller
 *   swaps the number for a mark by state with `Steps.Status`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";
import { useItem } from "#steps/state.ts";

/**
 * Renders the `span` with the steps' indicator class.
 */
const Disc = withContext("span", "indicator");

/**
 * Describes the props of the indicator: the props of a `span`.
 */
export type IndicatorProps = ComponentProps<typeof Disc>;

/**
 * Renders the indicator with the machine's indicator props merged over the caller's.
 *
 * @param props - The props of a `span`. Children replace the step's number.
 * @returns The `span` element.
 */
export function Indicator({ children, ...rest }: IndicatorProps): ReactElement {
  const { api } = useSteps();
  const { index } = useItem();

  return (
    <Disc {...mergeProps(api.getIndicatorProps({ index }), rest)}>{children ?? index + 1}</Disc>
  );
}
