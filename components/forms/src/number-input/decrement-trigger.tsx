/**
 * Renders the button that steps a number input's value down.
 *
 * @remarks
 *   The button renders inside a mark, and a mark at the box's start places it 4px from the edge. It
 *   is out of the tab order, because the arrow keys step the value from the input. A press steps
 *   the value once, and holding it steps it until the pointer lifts. The button is disabled at the
 *   minimum and in a read-only input. The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Mark } from "#input-group/mark.ts";
import { withContext } from "#number-input/context.ts";
import { useNumberInput } from "#number-input/machine.ts";

/**
 * Renders the `button` with the trigger recipe's class.
 */
const Stepper = withContext("button");

/**
 * Describes the props of the trigger: its accessible name and the props of a `button`.
 */
export interface DecrementTriggerProps extends Omit<ComponentProps<typeof Stepper>, "aria-label"> {
  /**
   * Accessible name of the button. Defaults to `Decrease value`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the trigger in a mark, with the machine's decrement props.
 *
 * @param props - The accessible name and the props of the `button`, merged over the machine's.
 * @returns The mark that contains the `button`.
 */
export function DecrementTrigger({
  label = "Decrease value",
  ...rest
}: DecrementTriggerProps): ReactElement {
  const api = useNumberInput();

  return (
    <Mark>
      <Stepper {...mergeProps(api.getDecrementTriggerProps(), { "aria-label": label }, rest)} />
    </Mark>
  );
}
