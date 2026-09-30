/**
 * Renders one item of a rating group: the radio a person presses to rate that value.
 *
 * @remarks
 *   The element is a `span` in the `radio` role with the rating's role description, its place in
 *   the set, and a roving tab stop on the rated item, or the first one while nothing is rated. It
 *   is named by the root's `getItemLabel` for the value it stands for, "3.5 stars" on a rated half.
 *   It is checked only while it is the rated item: the machine checks the first item while nothing
 *   is rated. A pointer over it previews its value, the first half of it with `allowHalf`. Every
 *   key pressed on it ends the pointer's hover first, because the machine takes no keys while a
 *   pointer rests on the group.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#rating-group/context.ts";
import { useRatingGroup } from "#rating-group/machine.ts";
import { useShared } from "#rating-group/state.ts";

/**
 * Renders the `span` with the rating group's item class.
 */
const Radio = withContext("span", "item");

/**
 * Describes the props of an item: its value and the props of a `span`.
 */
export interface ItemProps extends ComponentProps<typeof Radio> {
  /**
   * The value the item stands for, from 1 to the root's `count`.
   */
  readonly index: number;
}

/**
 * Renders the item with the machine's props, its name, its checked state and its keys.
 *
 * @param props - The value and the props of the `span`, merged over the machine's.
 * @returns The `span` element.
 */
export function Item({ children, index, ...rest }: ItemProps): ReactElement {
  const api = useRatingGroup();
  const { itemLabel, release } = useShared();
  const rated = api.value > 0 && Math.ceil(api.value) === index;
  const { "aria-checked": _first, "aria-label": _stars, ...machine } = api.getItemProps({ index });

  return (
    <Radio
      {...mergeProps(
        machine,
        {
          "aria-checked": rated,
          "aria-label": itemLabel(rated ? api.value : index),
          onKeyDown: release,
        },
        rest,
      )}
    >
      {children}
    </Radio>
  );
}
