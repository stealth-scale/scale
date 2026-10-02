/**
 * Runs the window over a data table's windowed region: the lines in or near the viewport, the
 * height of every line, where the region starts in the viewport, the line that contains focus, and
 * the report that the last line is near.
 *
 * @remarks
 *   TanStack Virtual measures a rendered line through `measure`, which reads the line's
 *   `data-index`. A line it has not measured takes the height of the first line it measured, and
 *   `estimateSize` before it measured one, so the scroll height matches the rows' own height after
 *   the first render. Each resize of the table measures the header's height and the region's
 *   offset in the viewport again. The line whose `data-key` element contains focus remains
 *   rendered while it scrolls out of view, so a focused control does not unmount, and so does the
 *   line the caller keeps, such as the row with the tab stop of a table with levels. `onEndReached`
 *   runs once per number of rows while the last line is within the overscan of the viewport. The
 *   React Compiler compiles no function that calls `useVirtualizer`, because the virtualizer reads
 *   the scroll position as it changes.
 */

import { type FocusEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  measureElement as sizeOf,
  useVirtualizer,
  type VirtualItem,
} from "@tanstack/react-virtual";

import {
  endedOf,
  focusedKeyOf,
  keeping,
  type Line,
  lineAt,
  type Placement,
  placementOf,
  replaced,
  sheetOf,
  UNPLACED,
} from "#data-table/windowed.ts";

/**
 * Describes the options of a window: the estimate, the line to keep, the lines, the report of the
 * end, the overscan, the number of rows and the viewport.
 */
export interface WindowOptions {
  /**
   * Height in pixels the window takes for a line before it measures the first one.
   */
  readonly estimateSize: number;

  /**
   * Id of a record whose row the window renders while it is out of view, or undefined for none.
   */
  readonly kept: string | undefined;

  /**
   * Lines of the windowed region.
   */
  readonly lines: readonly Line[];

  /**
   * Runs when the last line comes within the overscan of the viewport, once per number of rows.
   */
  readonly onEndReached: (() => void) | undefined;

  /**
   * Number of lines rendered beyond each end of the viewport.
   */
  readonly overscan: number;

  /**
   * Number of rows in the region, which the report of the end counts by.
   */
  readonly rows: number;

  /**
   * The scroller's viewport, the element that scrolls.
   */
  readonly viewport: HTMLDivElement | null;
}

/**
 * Describes a window: the lines to render, how to measure them, where the region starts, and the
 * handlers of its `tbody`.
 */
export interface WindowState {
  /**
   * Stores the region's `tbody`, whose place the window measures.
   */
  readonly body: (node: HTMLTableSectionElement | null) => void;

  /**
   * Lines to render, in index order.
   */
  readonly items: readonly VirtualItem[];

  /**
   * Measures a rendered line's height, as the line's ref.
   */
  readonly measure: (node: HTMLTableRowElement | null) => void;

  /**
   * Forgets the focused line when focus leaves the region.
   */
  readonly onBlur: (event: FocusEvent<HTMLTableSectionElement>) => void;

  /**
   * Stores the line that contains focus.
   */
  readonly onFocus: (event: FocusEvent<HTMLTableSectionElement>) => void;

  /**
   * Where the region starts.
   */
  readonly placement: Placement;

  /**
   * Height of every line together, measured or estimated.
   */
  readonly total: number;
}

/**
 * Returns where the region starts, measured again after every resize of its table.
 */
function usePlacement(
  body: HTMLTableSectionElement | null,
  viewport: HTMLElement | null,
): Placement {
  const [placement, setPlacement] = useState(UNPLACED);

  useLayoutEffect((): (() => void) | undefined => {
    if (body === null || viewport === null) return undefined;

    const observer = new ResizeObserver(() => {
      setPlacement((current) => replaced(current, placementOf(body, viewport)));
    });

    observer.observe(sheetOf(body));

    return (): void => {
      observer.disconnect();
    };
  }, [body, viewport]);

  return placement;
}

/**
 * Runs `onEndReached` once per number of rows while the last line is within the overscan.
 */
function useEndReached(ended: boolean, rows: number, onEndReached: (() => void) | undefined): void {
  const reported = useRef(-1);

  useEffect(() => {
    if (!ended || onEndReached === undefined || reported.current === rows) return;

    reported.current = rows;
    onEndReached();
  }, [ended, onEndReached, rows]);
}

/**
 * Runs the window over the region's lines inside the viewport.
 *
 * @param options - The estimate, the line to keep, the lines, the report of the end, the overscan,
 *   the number of rows and the viewport.
 * @returns The lines to render, the measuring ref, the placement, the total height and the
 *   `tbody`'s ref and focus handlers.
 */
export function useWindow({
  estimateSize,
  kept,
  lines,
  onEndReached,
  overscan,
  rows,
  viewport,
}: WindowOptions): WindowState {
  const [body, setBody] = useState<HTMLTableSectionElement | null>(null);
  const [focused, setFocused] = useState<string>();
  const [sampled, setSampled] = useState<number>();
  const placement = usePlacement(body, viewport);
  // eslint-disable-next-line react/incompatible-library -- the virtualizer reads the scroll position as it changes, so this hook must not be memoized
  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: lines.length,
    estimateSize: () => sampled ?? estimateSize,
    getItemKey: (index) => lineAt(lines, index).key,
    getScrollElement: () => viewport,
    measureElement: (element, entry, instance) => {
      const size = sizeOf(element, entry, instance);

      setSampled((current) => current ?? size);

      return size;
    },
    overscan,
    rangeExtractor: keeping([
      lines.findIndex((line) => line.key === focused),
      lines.findIndex((line) => !line.detail && line.row.id === kept),
    ]),
    scrollMargin: placement.margin,
  });
  const items = virtualizer.getVirtualItems();

  useEndReached(endedOf(virtualizer.range, overscan, lines.length), rows, onEndReached);

  return {
    body: setBody,
    items,
    measure: virtualizer.measureElement,
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(undefined);
    },
    onFocus: (event) => {
      setFocused(focusedKeyOf(event.target));
    },
    placement,
    total: virtualizer.getTotalSize(),
  };
}
