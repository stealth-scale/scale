/**
 * Renders one option of the segment group.
 *
 * @remarks
 *   The element is a `label` that points at the `input` the item renders after its children, so a
 *   press anywhere on the option checks it. The input is the radio assistive technology reads and
 *   the value a form submits. An icon renders as the item's first child, before its words. The
 *   input of a read-only group is enabled, so it takes focus and a form submits the group's value.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { type ItemOptions, splitItemProps, useRadioGroup } from "#radio-group/machine.ts";
import { ItemProvider } from "#radio-group/state.ts";
import { withContext } from "#segment-group/context.ts";

/**
 * Renders the `label` with the segment group's item class.
 */
const Segment = withContext("label", "item");

/**
 * Describes the props of an item: its value, whether it is disabled or invalid, and the props of a
 * `label`.
 *
 * @remarks
 *   `htmlFor`, which the machine sets, is left out.
 */
export interface ItemProps
  extends ItemOptions, Omit<ComponentProps<typeof Segment>, "htmlFor" | keyof ItemOptions> {}

/**
 * Renders the option and provides its options to the words inside it.
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
      <Segment {...mergeProps(api.getItemProps(options), attributes)}>
        {children}
        <input
          {...api.getItemHiddenInputProps(options)}
          disabled={api.getItemState(options).disabled}
        />
      </Segment>
    </ItemProvider>
  );
}
