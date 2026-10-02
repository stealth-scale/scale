/**
 * Builds the items, states, drag events and kits the sortable specs render and read.
 */

import { type ReactElement, type ReactNode } from "react";

import { type Draggable, type Droppable } from "@dnd-kit/dom";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { GripVerticalIcon } from "lucide-react";

import { type Announcing, type Snapshot } from "#sortable/announcements.ts";
import { withProvider } from "#sortable/context.ts";
import * as Sortable from "#sortable/index.ts";
import { type SortableItem, type SortableItems } from "#sortable/moves.ts";
import { RootProvider, type RootState } from "#sortable/state.ts";
import { wordsOf } from "#sortable/words.ts";

/**
 * Renders a root `div` that provides the recipe's classes to the parts a case renders without a
 * root.
 */
const Frame = withProvider("div", "root");

/**
 * Lists one list's items.
 */
export const STAGES: SortableItem[] = [{ id: "draft" }, { id: "review" }, { id: "publish" }];

/**
 * Lists a board's lists: two cards to do, one in progress, none done.
 */
export const COLUMNS: Record<string, SortableItem[]> = {
  doing: [{ id: "api" }],
  done: [],
  todo: [{ id: "spec" }, { id: "icons" }],
};

/**
 * Names the fixtures' items and lists.
 */
export const NAMES: Readonly<Record<string, string>> = {
  api: "Build the API",
  doing: "In progress",
  done: "Done",
  draft: "Draft",
  icons: "Design the icons",
  publish: "Publish",
  review: "Review",
  spec: "Write the spec",
  todo: "To do",
};

/**
 * Describes what a case changes in the state an announcement reads.
 */
export interface Stated {
  /**
   * Returns whether an item may move between two lists.
   */
  readonly canMove?: ((item: SortableItem, from: string, to: string) => boolean) | undefined;

  /**
   * Items the kit renders.
   */
  readonly items?: SortableItems | undefined;

  /**
   * Most items each list takes, by the list's id.
   */
  readonly limits?: Readonly<Record<string, number>> | undefined;

  /**
   * Record of the current drag.
   */
  readonly snapshot?: Snapshot | undefined;
}

/**
 * Returns the state an announcement reads: the board, its lists named, its items named and the
 * English words, with what a case changes.
 */
export function stateOf(stated: Stated = {}): Announcing {
  const items = stated.items ?? COLUMNS;
  const limits = stated.limits ?? {};
  const lists = new Map(
    ["todo", "doing", "done"].map((id) => [id, { label: NAMES[id], limit: limits[id] }]),
  );

  return {
    items,
    lists,
    names: new Map(Object.entries(NAMES)),
    rules: { canMove: stated.canMove, limitOf: (list) => lists.get(list)?.limit },
    snapshot: stated.snapshot ?? { items },
    words: wordsOf({}),
  };
}

/**
 * Describes the fields of a sortable a drag event reports.
 */
export interface Sorted {
  /**
   * Id of the list the sortable is in.
   */
  readonly group?: string | undefined;

  /**
   * Id of the sortable.
   */
  readonly id: string;

  /**
   * Index of the sortable in its list.
   */
  readonly index?: number | undefined;

  /**
   * Id of the list the drag picked the sortable up from.
   */
  readonly initialGroup?: string | undefined;

  /**
   * Index the drag picked the sortable up from.
   */
  readonly initialIndex?: number | undefined;

  /**
   * Kind of the sortable, `list` for a list of a board.
   */
  readonly type?: string | undefined;
}

/**
 * Returns a drag source with the fields a sortable reports and a manager that puts the pointer at
 * the origin.
 */
export function sourceWith(sorted: Sorted): Draggable {
  const manager = { dragOperation: { position: { current: { x: 0, y: 0 } }, shape: null } };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- A spec's source contains only the fields the kit and the move helper read.
  return {
    index: sorted.index ?? 0,
    initialGroup: sorted.initialGroup ?? sorted.group,
    initialIndex: sorted.initialIndex ?? sorted.index ?? 0,
    manager,
    ...sorted,
  } as unknown as Draggable;
}

/**
 * Returns a drop target with the fields a sortable or a list reports.
 */
export function targetWith(sorted: Sorted): Droppable {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- A spec's target contains only the fields the kit and the move helper read.
  return { shape: null, ...sorted } as unknown as Droppable;
}

/**
 * Describes a drag over event and whether a handler prevented it.
 */
export interface Passed {
  /**
   * The event a handler receives.
   */
  readonly event: DragOverEvent;

  /**
   * Returns whether a handler called `preventDefault`.
   */
  readonly prevented: () => boolean;
}

/**
 * Returns the start of a drag of a source.
 */
export function startOf(source: Draggable): DragStartEvent {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- A spec's event contains only the fields the kit reads.
  return { cancelable: false, operation: { source, target: null } } as unknown as DragStartEvent;
}

/**
 * Returns a drag over a target, which records a call to `preventDefault`.
 */
export function overOf(source: Draggable, target: Droppable | null): Passed {
  let prevented = false;
  const event = {
    operation: { source, target },
    preventDefault: (): void => {
      prevented = true;
    },
  };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- A spec's event contains only the fields the kit and the move helper read.
  return { event: event as unknown as DragOverEvent, prevented: () => prevented };
}

/**
 * Returns the end of a drag over a target, cancelled or not.
 */
export function endOf(source: Draggable, target: Droppable | null, canceled = false): DragEndEvent {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- A spec's event contains only the fields the kit and the move helper read.
  return { canceled, operation: { canceled, source, target } } as unknown as DragEndEvent;
}

/**
 * Returns a root's state for parts a case renders without a root: the registries a case reads back,
 * the words, a move that takes nothing, and the list a case marks as refusing.
 */
export function rootStateOf(items: SortableItems, refusing?: string): RootState {
  return {
    instructionsId: "instructions",
    items,
    lists: new Map(),
    move: () => false,
    names: new Map(),
    refusing,
    words: wordsOf({}),
  };
}

/**
 * Renders parts inside dnd-kit's provider, a root's state and the recipe's root `div`, without the
 * root's handlers.
 */
export function inside(state: RootState, children: ReactNode): ReactElement {
  return (
    <DragDropProvider>
      <RootProvider value={state}>
        <Frame>{children}</Frame>
      </RootProvider>
    </DragDropProvider>
  );
}

/**
 * Renders one list of the fixture's stages, each with a handle, the last one fixed.
 */
export function listed(props: Partial<Sortable.RootProps<SortableItem[]>> = {}): ReactElement {
  return (
    <Sortable.Root items={STAGES} {...props}>
      <Sortable.Items aria-label="Stages">
        {STAGES.map((stage, index) => (
          <Sortable.Item
            disabled={stage.id === "publish"}
            index={index}
            key={stage.id}
            label={NAMES[stage.id] ?? stage.id}
            value={stage.id}
          >
            <Sortable.Handle>
              <GripVerticalIcon />
            </Sortable.Handle>
            {NAMES[stage.id]}
          </Sortable.Item>
        ))}
      </Sortable.Items>
      <Sortable.Empty>No stages.</Sortable.Empty>
    </Sortable.Root>
  );
}

/**
 * Renders the fixture's board, each list with its rows and its message while empty.
 */
export function boarded(
  props: Partial<Sortable.RootProps<Record<string, SortableItem[]>>> = {},
  extra?: ReactNode,
): ReactElement {
  const columns = props.items ?? COLUMNS;

  return (
    <Sortable.Root items={columns} {...props}>
      <Sortable.Board>
        {Object.entries(columns).map(([id, cards]) => (
          <Sortable.List
            key={id}
            label={NAMES[id]}
            limit={id === "doing" ? 1 : undefined}
            value={id}
          >
            <Sortable.Items>
              {cards.map((card, index) => (
                <Sortable.Item
                  index={index}
                  key={card.id}
                  label={NAMES[card.id] ?? card.id}
                  value={card.id}
                >
                  <Sortable.Handle>
                    <GripVerticalIcon />
                  </Sortable.Handle>
                  {NAMES[card.id]}
                </Sortable.Item>
              ))}
            </Sortable.Items>
            <Sortable.Empty>No cards.</Sortable.Empty>
          </Sortable.List>
        ))}
      </Sortable.Board>
      {extra}
    </Sortable.Root>
  );
}
