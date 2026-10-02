/**
 * Renders a sortable kit's root: dnd-kit's provider around the lists and rows a person reorders,
 * with the kit's words, rules and moves.
 *
 * @remarks
 *   The root is controlled. `items` is what the lists render: an array for one list, or a record of
 *   a board's lists keyed by their ids. `onItemsChange` reports the items to render after a change:
 *   a drop, a move into another list while a drag lasts, the items from before a cancelled drag,
 *   and a move without a drag. `onItemMove` reports each finished move once, from the place the
 *   item left to the place it took, for a caller that saves it. `canMove` refuses a move from the
 *   list an item was picked up from into another list. A render function among the children takes
 *   the root's move without a drag, for a caller whose rows are no components of their own. The
 *   root renders the instructions every handle is described by in a hidden element, so they
 *   follow the words.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { DragDropProvider } from "@dnd-kit/react";

import { withProvider } from "#sortable/context.ts";
import { type ItemOf, type SortableItems, type SortableMove } from "#sortable/moves.ts";
import { useRoot } from "#sortable/root-state.ts";
import { RootProvider, type RootState } from "#sortable/state.ts";
import { type SortableWords } from "#sortable/words.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Box = withProvider("div", "root");

/**
 * Describes what the root hands a render function among its children.
 */
export interface SortableApi {
  /**
   * Moves an item to a place without a drag, and returns whether its list took it.
   */
  readonly move: RootState["move"];
}

/**
 * Describes the props of the root: the items, the callbacks, the rule, the words and the props of
 * a `div`.
 *
 * @typeParam Items - The kit's items: an array for one list, or a record of lists by their ids.
 */
export interface RootProps<Items extends SortableItems>
  extends Omit<ComponentProps<typeof Box>, "children">, SortableWords {
  /**
   * Returns whether an item may move from the list it was picked up from into another list. Every
   * move is allowed unless stated.
   */
  readonly canMove?: ((item: ItemOf<Items>, from: string, to: string) => boolean) | undefined;

  /**
   * Lists and rows of the kit, or a function that renders them from the root's move without a
   * drag.
   */
  readonly children?: ((api: SortableApi) => ReactNode) | ReactNode;

  /**
   * Items the lists render, controlled.
   */
  readonly items: Items;

  /**
   * Called once with each finished move, from the place the item left to the place it took.
   */
  readonly onItemMove?: ((move: SortableMove) => void) | undefined;

  /**
   * Called with the items to render after a change.
   */
  readonly onItemsChange?: ((items: Items) => void) | undefined;
}

/**
 * Renders dnd-kit's provider and the root `div` around the kit's lists and rows.
 *
 * @typeParam Items - The kit's items.
 * @param props - The items, the callbacks, the rule, the words and the props of a `div`.
 */
export function Root<Items extends SortableItems>(props: RootProps<Items>): ReactElement {
  const {
    cancelledLabel,
    canMove,
    children,
    droppedLabel,
    fullLabel,
    handleLabel,
    instructions,
    items,
    liftedLabel,
    movedLabel,
    onItemMove,
    onItemsChange,
    refusedLabel,
    roleDescription,
    ...rest
  } = props;
  const root = useRoot({
    canMove,
    items,
    onItemMove,
    onItemsChange,
    words: {
      cancelledLabel,
      droppedLabel,
      fullLabel,
      handleLabel,
      instructions,
      liftedLabel,
      movedLabel,
      refusedLabel,
      roleDescription,
    },
  });

  return (
    <RootProvider value={root.state}>
      <DragDropProvider plugins={root.plugins} {...root.handlers}>
        <Box {...rest}>
          {typeof children === "function" ? children({ move: root.state.move }) : children}
          <span hidden id={root.state.instructionsId}>
            {root.state.words.instructions}
          </span>
        </Box>
      </DragDropProvider>
    </RootProvider>
  );
}
