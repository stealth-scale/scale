/**
 * Renders one card of the set.
 *
 * @remarks
 *   The element is a `label` that points at the `input` the card renders after its children, so a
 *   press anywhere on the card checks it. The input is the radio assistive technology reads and
 *   the value a form submits. Its name is the card's title, and it lists the card's description
 *   and addon in `aria-describedby`. The input of a read-only set is enabled, so it takes focus and
 *   a form submits the set's value.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-card/context.ts";
import { DescribeProvider } from "#radio-card/state.ts";
import { type ItemOptions, splitItemProps, useRadioGroup } from "#radio-group/machine.ts";
import { ItemProvider } from "#radio-group/state.ts";

/**
 * Renders the `label` with the radio card's item class.
 */
const Card = withContext("label", "item");

/**
 * Describes the props of a card: its value, whether it is disabled or invalid, and the props of a
 * `label`.
 *
 * @remarks
 *   `htmlFor`, which the machine sets, is left out.
 */
export interface ItemProps
  extends ItemOptions, Omit<ComponentProps<typeof Card>, "htmlFor" | keyof ItemOptions> {}

/**
 * Renders the card and provides its options and its description registry to the parts inside it.
 *
 * @param props - The card's options and the props of a `label`.
 * @returns The `label` element, holding the parts and the `input` a form reads.
 */
export function Item(props: ItemProps): ReactElement {
  const api = useRadioGroup();
  const [options, rest] = splitItemProps(props);
  const { children, ...attributes } = rest;
  const [described, setDescribed] = useState<readonly string[]>([]);

  return (
    <ItemProvider value={options}>
      <DescribeProvider value={setDescribed}>
        <Card {...mergeProps(api.getItemProps(options), attributes)}>
          {children}
          <input
            {...api.getItemHiddenInputProps(options)}
            aria-describedby={described.length === 0 ? undefined : described.join(" ")}
            disabled={api.getItemState(options).disabled}
          />
        </Card>
      </DescribeProvider>
    </ItemProvider>
  );
}
