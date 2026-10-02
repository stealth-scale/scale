/**
 * Renders one list of a board: a drop target as a whole, so an empty list takes a drop, around the
 * list's heading, its rows and its message while it is empty.
 *
 * @remarks
 *   The list registers its name and its limit with the root, which the announcements and the rules
 *   read. It marks itself `data-full` while it has as many items as its limit, and `data-refuses`
 *   while it refuses the item dragged over it. Its id is its key in the items' record and
 *   differs from every item's id, because dnd-kit keeps one registry of drop targets.
 */

import { type ComponentProps, type ReactElement, useLayoutEffect } from "react";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";

import { withContext } from "#sortable/context.ts";
import { listOf } from "#sortable/moves.ts";
import { ListContext, useRootState } from "#sortable/state.ts";

/**
 * Renders the list's `div` with the recipe's list class.
 */
const Box = withContext("div", "list");

/**
 * Describes the props of a list: its id, its name, its limit and the props of a `div`.
 */
export interface ListProps extends ComponentProps<typeof Box> {
  /**
   * Name of the list, which names its rows and the announcements.
   */
  readonly label?: string | undefined;

  /**
   * Most items the list takes from other lists. No limit unless stated.
   */
  readonly limit?: number | undefined;

  /**
   * Id of the list, its key in the items' record.
   */
  readonly value: string;
}

/**
 * Renders a list as a drop target and registers it with the root.
 *
 * @param props - The list's id, name and limit, and the props of a `div`.
 */
export function List({ label, limit, value, ...props }: ListProps): ReactElement {
  const { items, lists, refusing } = useRootState();
  const { ref } = useDroppable({
    accept: "item",
    collisionPriority: CollisionPriority.Low,
    id: value,
    type: "list",
  });
  const full = limit !== undefined && listOf(items, value).length >= limit;

  useLayoutEffect(() => {
    lists.set(value, { label, limit });

    return (): void => {
      lists.delete(value);
    };
  }, [label, limit, lists, value]);

  return (
    <ListContext value={{ id: value, label }}>
      <Box
        data-full={full ? "" : undefined}
        data-refuses={refusing === value ? "" : undefined}
        ref={ref}
        {...props}
      />
    </ListContext>
  );
}
