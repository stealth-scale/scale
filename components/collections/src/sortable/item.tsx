/**
 * Renders one row a person drags: an `li` that dnd-kit sorts, with the handle a drag starts from.
 *
 * @remarks
 *   The row registers its name with the root, which the handle and the announcements name it by. A
 *   `disabled` row renders no handle, and dnd-kit neither lifts it nor drops another row on it. Its
 *   `index` is its place in its list as the caller renders it, and its list is the `Sortable.List`
 *   it renders in, or the one list of an array.
 */

import { type ComponentProps, type ReactElement, use, useLayoutEffect } from "react";

import { useSortable } from "@dnd-kit/react/sortable";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#sortable/context.ts";
import { ItemProvider, ListContext, useRootState } from "#sortable/state.ts";

/**
 * Renders the row's `li` with the recipe's item class.
 */
const Box = withContext("li", "item");

/**
 * Describes the props of a row: its id, place, name and state, and the props of an `li`.
 */
export interface ItemProps extends ComponentProps<typeof Box> {
  /**
   * Whether the row keeps its place. Off unless stated.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Index of the row in its list.
   */
  readonly index: number;

  /**
   * Name of the row, which names its handle and the announcements.
   */
  readonly label: string;

  /**
   * Id of the row's item.
   */
  readonly value: string;
}

/**
 * Renders a row dnd-kit sorts and registers its name with the root.
 *
 * @param props - The row's id, index, name and state, and the props of an `li`.
 */
export function Item({ disabled = false, index, label, value, ...props }: ItemProps): ReactElement {
  const list = use(ListContext);
  const { names } = useRootState();
  const { handleRef, ref } = useSortable({
    accept: "item",
    disabled,
    id: value,
    index,
    type: "item",
    ...omitUndefined({ group: list?.id }),
  });

  useLayoutEffect(() => {
    names.set(value, label);

    return (): void => {
      names.delete(value);
    };
  }, [label, names, value]);

  return (
    <ItemProvider value={{ disabled, handleRef, label }}>
      <Box data-disabled={disabled ? "" : undefined} ref={ref} {...props} />
    </ItemProvider>
  );
}
