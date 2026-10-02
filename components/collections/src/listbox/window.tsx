/**
 * Renders the rows of a long list that are in or near the viewport, and reserves the height of the
 * rest.
 *
 * @remarks
 *   A list of ten thousand rows renders about twenty. The outer element is as tall as every row,
 *   so the scrollbar matches the whole list. Every row is taken to have one height: the window
 *   measures the first rendered row, or takes `rowHeight`. The two elements set inline styles,
 *   because their geometry changes on every scroll event. The viewport of the content's scroll area
 *   is the scroll container, and the caller gives the content a height. Outside a listbox's
 *   content the window's parent element scrolls.
 */

import { type ReactElement, type ReactNode, use, useCallback, useEffect, useState } from "react";

import { ScrollerContext } from "#listbox/scroller.ts";
import { useWindowed } from "#listbox/windowed.ts";

/**
 * Describes the rows of the collection to render.
 */
export interface Range {
  /**
   * Index of the first row to render.
   */
  first: number;

  /**
   * Index one past the last row to render, so the pair slices the collection.
   */
  last: number;
}

/**
 * Describes the props of a window.
 */
export interface WindowProps {
  /**
   * Renders the rows between the two indexes.
   */
  readonly children: (range: Range) => ReactNode;

  /**
   * Number of rows in the collection.
   */
  readonly count: number;

  /**
   * Number of rows rendered beyond each end of the viewport. Defaults to 4.
   */
  readonly overscan?: number | undefined;

  /**
   * Height of one row in pixels. The window measures the first rendered row when the caller states
   * none.
   */
  readonly rowHeight?: number | undefined;
}

/**
 * Returns the height of the first rendered row, or 0 while no row is rendered.
 */
function measured(room: HTMLElement | null): number {
  const row = room?.firstElementChild?.firstElementChild;

  return row instanceof HTMLElement ? row.offsetHeight : 0;
}

/**
 * Returns the scroll position that puts one row fully in view.
 *
 * @remarks
 *   The position moves by the least distance, the way `scrollIntoView` with `block: "nearest"`
 *   does, and stays put for a row already in view. The offset of the window inside the scroll
 *   container is measured from the two rectangles.
 * @param room - The window's outer element.
 * @param scrolling - The scroll container.
 * @param start - Offset of the row's top inside the window.
 * @param rowHeight - Height of one row.
 * @returns The scroll position.
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
 * Renders the rows in or near the viewport, and passes the machine a function that scrolls to any
 * row.
 *
 * @param props - The row count, the row height, the overscan and the row renderer.
 * @returns The outer element, as tall as every row, that contains the rendered rows.
 */
export function Window({ children, count, overscan = 4, rowHeight }: WindowProps): ReactElement {
  const { hold } = useWindowed();
  const [room, setRoom] = useState<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(0);
  const [top, setTop] = useState(0);
  const [tall, setTall] = useState(0);
  const scrolling = use(ScrollerContext) ?? room?.parentElement ?? null;
  const height = rowHeight ?? drawn;

  /**
   * Stores the outer element, and the height of the first row rendered in it.
   */
  const held = useCallback((node: HTMLDivElement | null): void => {
    setRoom(node);
    setDrawn(measured(node));
  }, []);

  useEffect(() => {
    /**
     * Reads the scroll position and the viewport height of the scroll container.
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
