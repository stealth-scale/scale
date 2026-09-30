/**
 * Walks the marks of a chart without recharts' keyboard layer, such as a treemap: the arrow keys
 * step from mark to mark, and each step opens recharts' own tooltip at the mark.
 *
 * @remarks
 *   Recharts' treemap and sunburst take no key, and its sankey takes focus and ignores every key,
 *   while each other chart walks its data with the arrows. The chart's `svg` is its one tab stop.
 *   The walk listens on the plot's box in the capture phase and stops the focus and the keys it
 *   takes, so recharts' own layer, which cannot walk these charts, never sees them. Each mark has
 *   `data-walk` with its place. A step sends the pointer's `mouseout` from the mark before
 *   and `mouseover` to the mark after, so recharts opens its tooltip at the mark as it does under a
 *   pointer. React derives enter and leave from `mouseout`, so the step sends both. Focus that
 *   leaves the plot sends `mouseout` to the page, which closes the tooltip. Enter and Space click
 *   the mark the walk is at, so a chart whose marks act on a press, such as a timeline's markers,
 *   acts on the keys too.
 */

import { type FocusEvent, type KeyboardEvent, type RefObject, useRef } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Returns the place a key moves the walk to, given the place it is at (-1 before the first step)
 * and the last place.
 */
type Move = (at: number, last: number) => number;

/**
 * Keys the walk takes, each with the place it moves to: the next or the previous mark, the first or
 * the last. The walk stops at the ends, as recharts' layer does.
 */
const MOVES: Readonly<Partial<Record<string, Move>>> = {
  ArrowLeft: (at, last) => (at < 0 ? last : Math.max(at - 1, 0)),
  ArrowRight: (at, last) => Math.min(at + 1, last),
  End: (_at, last) => last,
  Home: () => 0,
};

/**
 * Keys that click the mark the walk is at, as a pointer's press does.
 */
const PRESSES: ReadonlySet<string> = new Set(["Enter", " "]);

/**
 * Describes the handlers the plot's box takes: the focus that opens the first mark, the focus that
 * leaves and the keys.
 */
export interface WalkProps {
  /**
   * Closes the tooltip when focus leaves the plot.
   */
  readonly onBlurCapture: (event: FocusEvent<HTMLElement>) => void;

  /**
   * Opens the tooltip at the first mark when the keyboard focuses the chart.
   */
  readonly onFocusCapture: (event: FocusEvent<HTMLElement>) => void;

  /**
   * Steps to the mark a key names.
   */
  readonly onKeyDownCapture: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Returns the marks inside the plot's box in the walk's order.
 */
function marksOf(box: HTMLElement): Array<HTMLElement | SVGElement> {
  return [...box.querySelectorAll<HTMLElement | SVGElement>("[data-walk]")].toSorted(
    (first, second) => Number(first.dataset["walk"]) - Number(second.dataset["walk"]),
  );
}

/**
 * Sends the pointer's pair from one mark to another: `mouseout` from the first and `mouseover` to
 * the second, or `mouseout` to the page without a second.
 *
 * @param from - The mark the pointer leaves, if any.
 * @param to - The mark the pointer enters, if any.
 */
function pointer(from: Element | undefined, to?: Element): void {
  from?.dispatchEvent(
    new MouseEvent("mouseout", { bubbles: true, relatedTarget: to ?? document.body }),
  );
  to?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, relatedTarget: from ?? null }));
}

/**
 * Opens recharts' tooltip at a mark after the mark's first layout, for the mark the chart shows
 * when it first renders, by sending the mark the pointer's `mouseover`.
 *
 * @remarks
 *   A treemap does not report its marks' positions, so recharts places its tooltip at
 *   `defaultIndex` in the plot's top-left corner. The pointer's event gives recharts the mark's
 *   position. A mark recharts replaces after it measures the plot sends the pointer again, so the
 *   tooltip follows the last layout.
 * @param mark - The mark's element.
 * @param opened - Whether the chart opens its tooltip at the mark.
 */
export function useOpened(mark: RefObject<Element | null>, opened: boolean): void {
  useSafeLayoutEffect(() => {
    if (opened && mark.current !== null) pointer(undefined, mark.current);
  }, [mark, opened]);
}

/**
 * Returns the handlers that walk the marks of the plot's box, which the chart spreads on
 * `Chart.Plot`.
 */
export function useWalk(): WalkProps {
  const place = useRef(-1);

  /**
   * Moves the pointer to the mark at a place from the mark the walk is at. React does not send
   * enter or leave for a move from a mark to itself.
   */
  const step = (box: HTMLElement, next: number): void => {
    const marks = marksOf(box);

    pointer(marks[place.current], marks[next]);
    place.current = next;
  };

  return {
    onBlurCapture: (event) => {
      const box = event.currentTarget;

      if (event.relatedTarget instanceof Node && box.contains(event.relatedTarget)) return;

      pointer(marksOf(box)[place.current]);
      place.current = -1;
    },
    onFocusCapture: (event) => {
      event.stopPropagation();

      if (place.current < 0 && event.target.matches(":focus-visible")) step(event.currentTarget, 0);
    },
    onKeyDownCapture: (event) => {
      const marks = marksOf(event.currentTarget);
      const pressed = PRESSES.has(event.key) ? marks[place.current] : undefined;

      if (pressed !== undefined) {
        event.preventDefault();
        event.stopPropagation();
        pressed.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        return;
      }

      const move = MOVES[event.key];

      if (move === undefined || marks.length === 0) return;

      event.preventDefault();
      event.stopPropagation();
      step(event.currentTarget, move(place.current, marks.length - 1));
    },
  };
}
