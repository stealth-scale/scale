/**
 * Applies a drag to a sortable kit's items as dnd-kit reports its start, each target it passes,
 * and its end.
 *
 * @remarks
 *   The start records the items and the place the item was picked up from, because a row that
 *   moves into another list mounts anew and dnd-kit then reports the new list as the one it started
 *   in. A drag within one list reports nothing until the drop: dnd-kit sorts the rows in the page
 *   while the drag lasts, and the drop reports the new order. A drag into another list of a board
 *   reports the items at once, so React renders the row in the list dnd-kit moved it into. A list
 *   that refuses the item takes no move, and the kit marks it while the item is over it. A cancel,
 *   and a drop on a list that refuses the item, report the items from before the drag, so the item
 *   goes back to where it was picked up. A finished move is reported once, on the drop.
 */

import { move } from "@dnd-kit/helpers";
import { type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/react";

import {
  type Announcing,
  listIdOf,
  originOf,
  refusedAt,
  sourceOf,
  targetPlaceOf,
} from "#sortable/announcements.ts";
import {
  placeOf,
  type SortableItems,
  type SortableMove,
  type SortablePlace,
} from "#sortable/moves.ts";

/**
 * Describes what the drag handlers read and report through.
 */
export interface DragInput {
  /**
   * Returns the kit's state as of its last render, with the drag's snapshot.
   */
  readonly latest: () => Announcing;

  /**
   * Called once with a finished move.
   */
  readonly onItemMove?: ((move: SortableMove) => void) | undefined;

  /**
   * Called with the items the kit renders after a change.
   */
  readonly onItemsChange?: ((items: SortableItems) => void) | undefined;

  /**
   * Marks the list that refuses the dragged item, or none.
   */
  readonly setRefusing: (list: string | undefined) => void;
}

/**
 * Describes the handlers the kit gives dnd-kit's provider.
 */
export interface DragHandlers {
  /**
   * Applies the drop, or restores the items after a cancel or a refused drop.
   */
  readonly onDragEnd: (event: DragEndEvent) => void;

  /**
   * Moves the item into another list, or refuses the move.
   */
  readonly onDragOver: (event: DragOverEvent) => void;

  /**
   * Records the items and the item's place from before the drag.
   */
  readonly onDragStart: (event: DragStartEvent) => void;
}

/**
 * Returns the place a drag's target offers its item, or undefined without a target.
 */
function offered(
  items: SortableItems,
  event: DragEndEvent | DragOverEvent,
): SortablePlace | undefined {
  const { source, target } = event.operation;

  return target === null ? undefined : targetPlaceOf(items, String(sourceOf(source).id), target);
}

/**
 * Moves the item into another list of a board as the drag passes it, unless the list refuses it.
 */
function passed(input: DragInput, event: DragOverEvent): void {
  const state = input.latest();
  const source = sourceOf(event.operation.source);
  const place = offered(state.items, event);
  const from = originOf(state, source).list;
  const refused = refusedAt(state, String(source.id), from, place);

  input.setRefusing(refused?.[0]);

  if (refused !== undefined) {
    event.preventDefault();

    return;
  }

  if (place === undefined || Array.isArray(state.items)) return;

  if (place.list !== listIdOf(source.group)) input.onItemsChange?.(move(state.items, event));
}

/**
 * Reports the items after a drop and the finished move, when the item moved.
 */
function dropped(input: DragInput, event: DragEndEvent, from: SortablePlace): void {
  const { items } = input.latest();
  const id = String(sourceOf(event.operation.source).id);
  const next = move(items, event);
  const to = placeOf(next, id);

  if (next !== items) input.onItemsChange?.(next);

  if (to !== undefined && (to.index !== from.index || to.list !== from.list)) {
    input.onItemMove?.({ from, id, to });
  }
}

/**
 * Ends a drag: restores the items after a cancel or a refused drop, and applies the drop otherwise.
 */
function ended(input: DragInput, event: DragEndEvent): void {
  const state = input.latest();
  const source = sourceOf(event.operation.source);
  const from = originOf(state, source);
  const refused = refusedAt(state, String(source.id), from.list, offered(state.items, event));

  input.setRefusing(undefined);
  state.snapshot.origin = undefined;

  if (!event.canceled && refused === undefined) {
    dropped(input, event, from);
  } else if (state.items !== state.snapshot.items) {
    input.onItemsChange?.(state.snapshot.items);
  }
}

/**
 * Returns the handlers the kit gives dnd-kit's provider.
 *
 * @param input - The kit's latest state, its callbacks and its refusal marker.
 */
export function dragHandlersOf(input: DragInput): DragHandlers {
  return {
    onDragEnd: (event) => {
      ended(input, event);
    },
    onDragOver: (event) => {
      passed(input, event);
    },
    onDragStart: (event) => {
      const { items, snapshot } = input.latest();

      snapshot.items = items;
      snapshot.origin = placeOf(items, String(sourceOf(event.operation.source).id));
      input.setRefusing(undefined);
    },
  };
}
