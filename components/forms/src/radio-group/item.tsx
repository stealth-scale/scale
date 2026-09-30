/**
 * Renders one option of the group.
 *
 * @remarks
 *   The element is a `label` that points at the `input` the item renders after its children, so a
 *   press anywhere on the row checks the option. The input is the radio assistive technology reads
 *   and the value a form submits. The item renders it, so a caller cannot leave it out. The circle
 *   is `aria-hidden`, so the state is announced once. The input of a read-only group is enabled, so
 *   it takes focus and a form submits the group's value. The machine disables it and cancels a
 *   press on it, and the item keeps only the cancelling.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-group/context.ts";
import { type ItemOptions, splitItemProps, useRadioGroup } from "#radio-group/machine.ts";
import { ItemProvider } from "#radio-group/state.ts";

/**
 * Renders the `label` with the radio group's item class.
 */
const Row = withContext("label", "item");

/**
 * Describes the props of an item: its value, whether it is disabled or invalid, and the props of a
 * `label`.
 *
 * @remarks
 *   `htmlFor`, which the machine sets, is left out.
 */
export interface ItemProps
  extends ItemOptions, Omit<ComponentProps<typeof Row>, "htmlFor" | keyof ItemOptions> {}

/**
 * Renders the row and provides its options to the circle and the words inside it.
 *
 * @param props - The item's options and the props of a `label`.
 * @returns The `label` element, holding the parts and the `input` a form reads.
 */
export function Item(props: ItemProps): ReactElement {
  const api = useRadioGroup();
  const [options, rest] = splitItemProps(props);
  const { children, ...attributes } = rest;

  return (
    <ItemProvider value={options}>
      <Row {...mergeProps(api.getItemProps(options), attributes)}>
        {children}
        <input
          {...api.getItemHiddenInputProps(options)}
          disabled={api.getItemState(options).disabled}
        />
      </Row>
    </ItemProvider>
  );
}
