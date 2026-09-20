/**
 * Draws the rows of a long list that are near enough to be seen, and holds the room the rest take.
 *
 * @remarks
 *   A list of ten thousand rows puts ten thousand elements in the document, and a browser lays out
 *   and paints every one of them. This keeps about a screenful of them there. The rows that are
 *   not drawn are accounted for by height alone, so the scrollbar is the length every row would
 *   come to and the list is as long as it says it is.
 *   Every row is taken to be the same height, because measuring each one means laying out every
 *   one, which is the cost this avoids. One row is measured on the first draw and the rest are
 *   counted off it, so nothing states a height that the theme is free to move. A caller whose rows
 *   are not all one height states the height instead, and gets whatever that number says.
 *   The two elements this draws carry inline styles rather than a recipe. Their geometry is
 *   arithmetic on the row height and the scroll position, which changes on every scroll event and
 *   which no stylesheet can hold.
 *   The scrolling element is the content above this, which is what the machine scrolls and what
 *   carries `overflow`. A caller gives that element a height, because a window inside a box with no
 *   height of its own has nothing to scroll within.
 */

import { type ReactElement, type ReactNode, useCallback, useEffect, useState } from "react";

import { useWindowed } from "#listbox/windowed.ts";

/**
 * Describes which rows of the collection are near enough to draw.
 */
export interface Range {
  /**
   * The first row to draw, counted from the start of the collection.
   */
  first: number;

  /**
   * One past the last row to draw, so the pair slices the collection.
   */
  last: number;
}

/**
 * Describes what a window takes.
 */
export interface WindowProps {
  /**
   * Draws the rows between the two positions it is handed.
   */
  readonly children: (range: Range) => ReactNode;

  /**
   * How many rows the list holds in all, drawn or not.
   */
  readonly count: number;

  /**
   * How many rows past each end of the window are drawn, so a fast scroll finds rows already
   * there.
   */
  readonly overscan?: number | undefined;

  /**
   * How tall one row is, which the window is measured in. Taken from the first row drawn where a
   * caller states none.
   */
  readonly rowHeight?: number | undefined;
}

/**
 * Reports how tall the first row drawn came out, or nothing while none is drawn.
 */
function measured(room: HTMLElement | null): number {
  const row = room?.firstElementChild?.firstElementChild;

  return row instanceof HTMLElement ? row.offsetHeight : 0;
}

/**
 * Reports where the list has to be scrolled to for one row to be wholly on screen, which is where
 * it already is for a row that is.
 *
 * @remarks
 *   The nearest edge, the way a browser scrolls an element into view. A list that put the row at
 *   the top of its window on every press would jump a row's height each time and the highlight
 *   would never appear to move at all.
 *   The room the rows sit in starts below whatever the list leaves above them, which the two
 *   rectangles measure rather than assume. A distance counted from the list's own top left the
 *   first row cut off by exactly that much.
 * @param room - The box holding the room every row would take.
 * @param scrolling - The box the list scrolls within.
 * @param start - How far into the room the row begins.
 * @param rowHeight - How tall one row is.
 * @returns Where the list should be scrolled to.
 */
function reaching(
  room: HTMLElement,
  scrolling: HTMLElement,
  start: number,
  rowHeight: number,
): number {
  const above =
    scrolling.scrollTop + room.getBoundingClientRect().top - scrolling.getBoundingClientRect().top;
  const from = above + start;
  const to = from + rowHeight;
  const seen = scrolling.scrollTop;
  const shown = scrolling.clientHeight;

  if (from < seen) return from;

  return to > seen + shown ? to - shown : seen;
}

/**
 * Draws the rows a reader can reach and holds the room the rest would take.
 *
 * @param props - The count of rows, how tall one is, and what draws them.
 * @returns The room every row would come to, holding the rows near enough to be seen.
 */
export function Window({ children, count, overscan = 4, rowHeight }: WindowProps): ReactElement {
  const { hold } = useWindowed();
  const [room, setRoom] = useState<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(0);
  const [top, setTop] = useState(0);
  const [tall, setTall] = useState(0);
  const scrolling = room?.parentElement ?? null;
  const height = rowHeight ?? drawn;

  /**
   * Takes the box the rows sit in, and one row's height off the first row drawn in it.
   */
  const held = useCallback((node: HTMLDivElement | null): void => {
    setRoom(node);
    setDrawn(measured(node));
  }, []);

  useEffect(() => {
    /**
     * Reads where the list has been scrolled to and how much of it is on screen.
     */
    const read = (): void => {
      if (scrolling === null) return;

      setTop(scrolling.scrollTop);
      setTall(scrolling.clientHeight);
    };

    read();
    scrolling?.addEventListener("scroll", read, { passive: true });

    return (): void => {
      scrolling?.removeEventListener("scroll", read);
    };
  }, [scrolling]);

  useEffect(() => {
    hold((index) => {
      if (room === null || scrolling === null || height === 0) return;

      scrolling.scrollTo({ top: reaching(room, scrolling, index * height, height) });
    });

    return (): void => {
      hold(null);
    };
  }, [height, hold, room, scrolling]);

  const first = height === 0 ? 0 : Math.max(0, Math.floor(top / height) - overscan);
  const last =
    height === 0
      ? Math.min(count, overscan)
      : Math.min(count, Math.ceil((top + tall) / height) + overscan);

  return (
    <div
      ref={held}
      style={{
        blockSize: height === 0 ? undefined : `${String(count * height)}px`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          insetBlockStart: `${String(first * height)}px`,
          insetInline: 0,
          position: height === 0 ? undefined : "absolute",
        }}
      >
        {children({ first, last })}
      </div>
    </div>
  );
}
