/**
 * Renders one step of the list.
 *
 * @remarks
 *   The element is an `li`. The item provides its index to the parts inside it. The machine's
 *   `aria-current` is dropped, because `Steps.Title` states the current step and the completed
 *   steps in words, which a screen reader reads in every mode.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";
import { ItemProvider } from "#steps/state.ts";

/**
 * Renders the `li` with the steps' item class.
 */
const Held = withContext("li", "item");

/**
 * Describes the props of an item: the step's index and the props of an `li`.
 */
export interface ItemProps extends ComponentProps<typeof Held> {
  /**
   * Index of the step, from zero.
   */
  readonly index: number;
}

/**
 * Renders the item with the machine's item props and provides its index to the parts inside it.
 *
 * @param props - The step's index and the props of an `li`.
 * @returns The `li` element.
 */
export function Item({ index, ...rest }: ItemProps): ReactElement {
  const { api } = useSteps();
  const item: ComponentProps<typeof Held> = {
    ...api.getItemProps({ index }),
    "aria-current": undefined,
  };

  return (
    <ItemProvider value={{ index }}>
      <Held {...mergeProps(item, rest)} />
    </ItemProvider>
  );
}
