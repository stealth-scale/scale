/**
 * Walks the cells of a heat grid with the keys, as a data grid does: the grid is one tab stop, the
 * arrows move to the next cell in their direction, Home and End move to the row's ends, and
 * Control or Command with Home or End move to the grid's first and last cell.
 *
 * @remarks
 *   A place without a cell, such as a day outside a calendar's window, has no key, and the arrows
 *   pass over it. An arrow at the grid's edge keeps focus where it is. Left and right swap in a
 *   grid laid out right to left. An arrow with Alt, Control or Command belongs to the browser and
 *   the system, so the walk leaves it alone. Enter, Space and a press call `onSelect` with the
 *   cell's key. The readout shows the cell under the pointer, else the cell with focus, and before
 *   either enters a cell it shows the cell the caller names first. Escape hides the readout until
 *   the pointer or focus moves.
 */

import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useState,
} from "react";

import { SHOWN } from "#heat/recipe.ts";

/**
 * Describes where a heat grid's cells are: a row per body row, with each column's key, or undefined
 * where the place has no cell.
 */
export type Places = ReadonlyArray<ReadonlyArray<string | undefined>>;

/**
 * Attribute a cell writes with its key, by which the walk finds the cell.
 */
export const CELL = "data-cell";

/**
 * Describes a cell's neighbours as the moves read them.
 */
interface Around {
  /**
   * Keys of the cell's column, top to bottom.
   */
  readonly across: ReadonlyArray<string | undefined>;

  /**
   * Place of the cell in its row.
   */
  readonly column: number;

  /**
   * Keys Home and End move between: the row's cells, or the grid's with Control or Command.
   */
  readonly ends: readonly string[];

  /**
   * Step along the row that moves towards its end: 1 left to right, -1 right to left.
   */
  readonly forward: number;

  /**
   * Keys of the cell's row, start to end.
   */
  readonly line: ReadonlyArray<string | undefined>;

  /**
   * Place of the cell's row in the grid.
   */
  readonly row: number;
}

/**
 * Returns the keys of the places that have a cell, in order.
 */
function keysOf(places: ReadonlyArray<string | undefined>): readonly string[] {
  return places.filter((key): key is string => key !== undefined);
}

/**
 * Returns the key of the first cell after a place along a row or a column, stepping by `step`, or
 * undefined when no cell is before the edge.
 */
function along(
  keys: ReadonlyArray<string | undefined>,
  from: number,
  step: number,
): string | undefined {
  return keysOf(step > 0 ? keys.slice(from + 1) : keys.slice(0, from).toReversed())[0];
}

/**
 * Maps each key the walk handles to the cell it moves to, or undefined where no cell is in that
 * direction.
 */
const MOVES: Readonly<Record<string, (around: Around) => string | undefined>> = {
  ArrowDown: ({ across, row }) => along(across, row, 1),
  ArrowLeft: ({ column, forward, line }) => along(line, column, -forward),
  ArrowRight: ({ column, forward, line }) => along(line, column, forward),
  ArrowUp: ({ across, row }) => along(across, row, -1),
  End: ({ ends }) => ends.at(-1),
  Home: ({ ends }) => ends[0],
};

/**
 * Describes a key press as the walk reads it.
 */
export interface Press {
  /**
   * Whether Control is pressed.
   */
  readonly ctrlKey: boolean;

  /**
   * Key pressed, as `KeyboardEvent.key` names it.
   */
  readonly key: string;

  /**
   * Whether Command is pressed.
   */
  readonly metaKey: boolean;
}

/**
 * Returns the key of the cell a key press moves to from a cell.
 *
 * @param places - The grid's cells.
 * @param from - The key of the cell with focus.
 * @param press - The key and whether Control or Command is pressed.
 * @param rightToLeft - Whether the grid is laid out right to left.
 * @returns The cell's key, the key `from` at the grid's edge, or undefined for a key the walk does
 *   not handle.
 */
export function stepOf(
  places: Places,
  from: string,
  press: Press,
  rightToLeft: boolean,
): string | undefined {
  const move = MOVES[press.key];

  if (move === undefined) return undefined;

  const row = places.findIndex((line) => line.includes(from));
  const line = places[row] ?? [];
  const column = line.indexOf(from);
  const chorded = press.ctrlKey || press.metaKey;

  return (
    move({
      across: places.map((each) => each[column]),
      column,
      ends: keysOf(chorded ? places.flat() : line),
      forward: rightToLeft ? -1 : 1,
      line,
      row,
    }) ?? from
  );
}

/**
 * Returns the cell with a key inside an element, or undefined where none has it.
 *
 * @remarks
 *   The cells are compared by their keys, because a key is the caller's data, such as a date or a
 *   pair of names, and a selector built from it has to escape every character a selector reads.
 * @param root - The element the cells are in.
 * @param key - The value the cell states in `data-cell`.
 */
export function cellIn(root: Element, key: string): HTMLElement | undefined {
  return [...root.querySelectorAll<HTMLElement>(`[${CELL}]`)].find(
    (cell) => cell.dataset["cell"] === key,
  );
}

/**
 * Lists the values of `overflow-x` under which an element scrolls sideways.
 */
const SCROLLING = new Set(["auto", "scroll"]);

/**
 * Scrolls a heat grid's scroll area sideways until a cell is inside it, and leaves the page where
 * it is.
 *
 * @remarks
 *   The scroll area is the first element in the frame that contains the cell, scrolls sideways and
 *   is wider inside than it is, so a grid that fits scrolls nothing. Chromium also reports the
 *   area's overflow on the elements around it, which do not scroll. The cell's own `scrollIntoView`
 *   also scrolls the page, and Firefox 155 ignores its `container: "nearest"`. A cell under the
 *   sticky row headings is revealed only up to the area's edge.
 * @param cell - A cell inside the scroll area.
 * @param frame - The element the grid's scroll area is in.
 */
export function reveal(cell: HTMLElement, frame: Element): void {
  const view = [...frame.querySelectorAll("*")].find(
    (element) =>
      element.contains(cell) &&
      element.scrollWidth > element.clientWidth &&
      SCROLLING.has(getComputedStyle(element).overflowX),
  );

  if (view === undefined) return;

  const at = cell.getBoundingClientRect();
  const box = view.getBoundingClientRect();

  view.scrollLeft += Math.max(0, at.right - box.right) - Math.max(0, box.left - at.left);
}

/**
 * Returns the key of the cell an event's target is in, or undefined outside a cell.
 */
function keyOf(target: EventTarget): string | undefined {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- React targets an element with every event a grid receives
  return (target as Element).closest<HTMLElement>(`[${CELL}]`)?.dataset["cell"];
}

/**
 * Returns whether a key press belongs to the browser or the system: an arrow with a modifier, or
 * any key with Alt.
 */
function reserved(event: KeyboardEvent<HTMLElement>): boolean {
  const chorded = event.ctrlKey || event.metaKey;

  return event.altKey || (chorded && event.key.startsWith("Arrow"));
}

/**
 * Describes what a key press on a cell acts on besides the focus: the readout and the selection.
 */
interface Keyed {
  /**
   * Hides the readout until the pointer or focus moves.
   */
  readonly hide: () => void;

  /**
   * Called with the focused cell's key on Enter or Space.
   */
  readonly onSelect: WalkOptions["onSelect"];
}

/**
 * Handles a key press on a cell: Escape hides the readout, Enter and Space select the cell, and the
 * arrows, Home and End move focus to the cell they name.
 *
 * @param event - The key press, on the grid's element.
 * @param places - The grid's cells.
 * @param keyed - The readout's hiding and the selection's handler.
 */
function pressed(event: KeyboardEvent<HTMLElement>, places: Places, keyed: Keyed): void {
  const from = keyOf(event.target);

  if (from === undefined || reserved(event)) return;

  if (event.key === "Escape") {
    keyed.hide();

    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    keyed.onSelect?.(from);

    return;
  }

  const to = stepOf(places, from, event, getComputedStyle(event.currentTarget).direction === "rtl");

  if (to === undefined) return;

  event.preventDefault();
  cellIn(event.currentTarget, to)?.focus();
}

/**
 * Describes the handlers the walk puts on the grid's element.
 */
export interface WalkHandlers {
  /**
   * Forgets the focused cell when focus leaves the grid.
   */
  readonly onBlur: (event: FocusEvent<HTMLElement>) => void;

  /**
   * Calls `onSelect` with the pressed cell's key.
   */
  readonly onClick: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Moves the tab stop to the cell that takes focus.
   */
  readonly onFocus: (event: FocusEvent<HTMLElement>) => void;

  /**
   * Moves focus with the arrows, Home and End, selects with Enter and Space, and hides the readout
   * with Escape.
   */
  readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;

  /**
   * Forgets the cell under the pointer when the pointer leaves the grid.
   */
  readonly onPointerLeave: () => void;

  /**
   * Records the cell under the pointer.
   */
  readonly onPointerOver: (event: PointerEvent<HTMLElement>) => void;
}

/**
 * Describes the props the walk gives a cell: its key, its tab stop and whether the readout shows
 * it.
 */
export interface WalkedCell {
  /**
   * Key of the cell.
   */
  readonly [CELL]: string;

  /**
   * Present while the readout shows the cell.
   */
  readonly [SHOWN]?: "" | undefined;

  /**
   * 0 on the cell with the tab stop, -1 on every other cell.
   */
  readonly tabIndex: number;
}

/**
 * Describes the walk: the cell with the tab stop, the cell the readout shows, the grid's handlers
 * and each cell's props.
 */
export interface Walk {
  /**
   * Returns the props of the cell with a key.
   */
  readonly cellOf: (key: string) => WalkedCell;

  /**
   * Handlers of the grid's element.
   */
  readonly handlers: WalkHandlers;

  /**
   * Key of the cell the readout shows, if any.
   */
  readonly shown: string | undefined;

  /**
   * Key of the cell with the tab stop, if the grid has a cell.
   */
  readonly stop: string | undefined;
}

/**
 * Describes what the walk starts from and whom it tells of a selection.
 */
export interface WalkOptions {
  /**
   * Key of the cell the readout shows and the tab stop starts at, until the pointer or focus
   * enters a cell.
   */
  readonly initial?: string | undefined;

  /**
   * Called with a cell's key on Enter, Space or a press.
   */
  readonly onSelect?: ((key: string) => void) | undefined;
}

/**
 * Tracks a heat grid's tab stop, the cell under the pointer, the cell with focus and the readout,
 * and returns the grid's handlers.
 *
 * @param places - The grid's cells.
 * @param options - The cell to start at and the selection's handler.
 */
export function useWalk(places: Places, { initial, onSelect }: WalkOptions): Walk {
  const [stop, setStop] = useState(initial);
  const [pointed, setPointed] = useState<string>();
  const [focused, setFocused] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [hidden, setHidden] = useState(false);
  const keys = keysOf(places.flat());
  const current = stop !== undefined && keys.includes(stop) ? stop : keys[0];
  const shown = hidden ? undefined : (pointed ?? focused ?? (touched ? undefined : initial));

  /**
   * Shows the readout again and stops showing the first cell, after the pointer or focus enters a
   * cell.
   */
  const entered = (): void => {
    setTouched(true);
    setHidden(false);
  };

  return {
    cellOf: (key) => ({
      [CELL]: key,
      [SHOWN]: key === shown ? "" : undefined,
      tabIndex: key === current ? 0 : -1,
    }),
    handlers: {
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(undefined);
      },
      onClick: (event) => {
        const key = keyOf(event.target);

        if (key !== undefined) onSelect?.(key);
      },
      onFocus: (event) => {
        const key = keyOf(event.target);

        if (key === undefined) return;

        setFocused(key);
        setStop(key);
        entered();
      },
      onKeyDown: (event) => {
        pressed(event, places, {
          hide: () => {
            setHidden(true);
          },
          onSelect,
        });
      },
      onPointerLeave: () => {
        setPointed(undefined);
      },
      onPointerOver: (event) => {
        const key = keyOf(event.target);

        setPointed(key);

        if (key !== undefined) entered();
      },
    },
    shown,
    stop: current,
  };
}
