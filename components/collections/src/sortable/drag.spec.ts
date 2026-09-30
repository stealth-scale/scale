import { describe, expect, it } from "vitest";

import { type Announcing } from "#sortable/announcements.ts";
import { type DragHandlers, dragHandlersOf } from "#sortable/drag.ts";
import { type SortableItems, type SortableMove } from "#sortable/moves.ts";
import {
  COLUMNS,
  endOf,
  overOf,
  sourceWith,
  STAGES,
  startOf,
  type Stated,
  stateOf,
  targetWith,
} from "#sortable/sortable.fixtures.tsx";

interface Dragged {
  readonly changes: SortableItems[];
  readonly handlers: DragHandlers;
  readonly moves: SortableMove[];
  readonly refusing: Array<string | undefined>;
  readonly state: Announcing;
}

function dragged(stated: Stated = {}): Dragged {
  const state = stateOf(stated);
  const changes: SortableItems[] = [];
  const moves: SortableMove[] = [];
  const refusing: Array<string | undefined> = [];
  const handlers = dragHandlersOf({
    latest: () => state,
    onItemMove: (move) => {
      moves.push(move);
    },
    onItemsChange: (items) => {
      changes.push(items);
    },
    setRefusing: (list) => {
      refusing.push(list);
    },
  });

  return { changes, handlers, moves, refusing, state };
}

const SPEC = sourceWith({ group: "todo", id: "spec", index: 0 });

describe("drag", () => {
  it("records the items from before the drag", () => {
    const { handlers, state } = dragged();

    handlers.onDragStart(startOf(SPEC));

    expect(state.snapshot.items).toBe(COLUMNS);
  });

  it("records the place the item was picked up from", () => {
    const { handlers, state } = dragged();

    handlers.onDragStart(startOf(sourceWith({ group: "todo", id: "icons", index: 1 })));

    expect(state.snapshot.origin).toStrictEqual({ index: 1, list: "todo" });
  });

  it("clears the refusing list when a drag starts", () => {
    const { handlers, refusing } = dragged();

    handlers.onDragStart(startOf(SPEC));

    expect(refusing).toStrictEqual([undefined]);
  });

  it("reports the items with the item moved into another list it passes", () => {
    const { changes, handlers } = dragged();

    handlers.onDragOver(overOf(SPEC, targetWith({ group: "doing", id: "api", index: 0 })).event);

    expect(
      (changes[0] as Record<string, Array<{ id: string }>>)["doing"]?.map(({ id }) => id),
    ).toStrictEqual(["spec", "api"]);
  });

  it("reports no items while the item passes a row of its own list", () => {
    const { changes, handlers } = dragged();

    handlers.onDragOver(overOf(SPEC, targetWith({ group: "todo", id: "icons", index: 1 })).event);

    expect(changes).toStrictEqual([]);
  });

  it("reports no items for a drag over an array's rows", () => {
    const { changes, handlers } = dragged({ items: STAGES });

    handlers.onDragOver(
      overOf(sourceWith({ id: "draft" }), targetWith({ id: "review", index: 1 })).event,
    );

    expect(changes).toStrictEqual([]);
  });

  it("reports no items while the drag is over no target", () => {
    const { changes, handlers } = dragged();

    handlers.onDragOver(overOf(SPEC, null).event);

    expect(changes).toStrictEqual([]);
  });

  it("prevents the move into a list the rule refuses", () => {
    const { handlers } = dragged({ canMove: () => false });
    const over = overOf(SPEC, targetWith({ id: "done", type: "list" }));

    handlers.onDragOver(over.event);

    expect(over.prevented()).toBe(true);
  });

  it("marks the list that refuses the item", () => {
    const { handlers, refusing } = dragged({ canMove: () => false });

    handlers.onDragOver(overOf(SPEC, targetWith({ id: "done", type: "list" })).event);

    expect(refusing).toStrictEqual(["done"]);
  });

  it("reports no items for a move into a list that refuses the item", () => {
    const { changes, handlers } = dragged({ limits: { doing: 1 } });

    handlers.onDragOver(overOf(SPEC, targetWith({ group: "doing", id: "api", index: 0 })).event);

    expect(changes).toStrictEqual([]);
  });

  it("asks the rule about the list the drag's start recorded", () => {
    const asked: string[] = [];
    const snapshot = { items: COLUMNS, origin: { index: 0, list: "todo" } };
    const { handlers } = dragged({
      canMove: (_item, from) => {
        asked.push(from);

        return true;
      },
      snapshot,
    });
    const source = sourceWith({ group: "doing", id: "spec", index: 0, initialGroup: "doing" });

    handlers.onDragOver(overOf(source, targetWith({ id: "done", type: "list" })).event);

    expect(asked).toStrictEqual(["todo"]);
  });

  it("reports the order after a drop within one list", () => {
    const { changes, handlers } = dragged({ items: STAGES });
    const source = sourceWith({ id: "draft", index: 2, initialIndex: 0 });

    handlers.onDragEnd(endOf(source, targetWith({ id: "draft", index: 2 })));

    expect((changes[0] as Array<{ id: string }>).map(({ id }) => id)).toStrictEqual([
      "review",
      "publish",
      "draft",
    ]);
  });

  it("reports the finished move once on the drop", () => {
    const { handlers, moves } = dragged({ items: STAGES });
    const source = sourceWith({ id: "draft", index: 2, initialIndex: 0 });

    handlers.onDragEnd(endOf(source, targetWith({ id: "draft", index: 2 })));

    expect(moves).toStrictEqual([
      { from: { index: 0, list: undefined }, id: "draft", to: { index: 2 } },
    ]);
  });

  it("reports no move for a drop where the item was picked up", () => {
    const { changes, handlers, moves } = dragged({ items: STAGES });

    handlers.onDragEnd(endOf(sourceWith({ id: "draft" }), targetWith({ id: "draft" })));

    expect([changes, moves]).toStrictEqual([[], []]);
  });

  it("reports the move of an item a drag already took into another list", () => {
    const items = { doing: [{ id: "spec" }, { id: "api" }], done: [], todo: [{ id: "icons" }] };
    const { handlers, moves } = dragged({
      items,
      snapshot: { items: COLUMNS, origin: { index: 0, list: "todo" } },
    });
    const source = sourceWith({ group: "doing", id: "spec", index: 0 });

    handlers.onDragEnd(endOf(source, targetWith({ group: "doing", id: "spec", index: 0 })));

    expect(moves).toStrictEqual([
      { from: { index: 0, list: "todo" }, id: "spec", to: { index: 0, list: "doing" } },
    ]);
  });

  it("restores the items from before a cancelled drag", () => {
    const items = { doing: [{ id: "spec" }, { id: "api" }], done: [], todo: [{ id: "icons" }] };
    const { changes, handlers } = dragged({ items, snapshot: { items: COLUMNS } });

    handlers.onDragEnd(endOf(SPEC, null, true));

    expect(changes).toStrictEqual([COLUMNS]);
  });

  it("reports nothing for a cancelled drag that changed nothing", () => {
    const { changes, handlers } = dragged();

    handlers.onDragEnd(endOf(SPEC, null, true));

    expect(changes).toStrictEqual([]);
  });

  it("restores the items from before a drop on a list that refuses the item", () => {
    const items = { doing: [{ id: "api" }], done: [], todo: [{ id: "spec" }] };
    const { changes, handlers } = dragged({
      canMove: () => false,
      items,
      snapshot: { items: COLUMNS },
    });

    handlers.onDragEnd(endOf(SPEC, targetWith({ id: "done", type: "list" })));

    expect(changes).toStrictEqual([COLUMNS]);
  });

  it("clears the record of the origin at the drag's end", () => {
    const { handlers, state } = dragged({
      snapshot: { items: COLUMNS, origin: { index: 0, list: "todo" } },
    });

    handlers.onDragEnd(endOf(SPEC, null, true));

    expect(state.snapshot.origin).toBeUndefined();
  });

  it("clears the refusing list at the drag's end", () => {
    const { handlers, refusing } = dragged();

    handlers.onDragEnd(endOf(SPEC, null, true));

    expect(refusing).toStrictEqual([undefined]);
  });
});
