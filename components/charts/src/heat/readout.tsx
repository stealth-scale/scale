/**
 * Renders a heat grid's readout: the kit's tooltip above the cell the walk shows, or below it where
 * the frame has no room above.
 *
 * @remarks
 *   The readout is a child of the grid's frame, outside the scroll area, so the area never clips
 *   it. It places itself after layout, again when the grid scrolls and when the frame resizes,
 *   centred on its cell and kept inside the frame's width, and it states `data-clipped` while its
 *   cell is out of the scroll area's view. It takes no pointer, so the cells under it receive the
 *   pointer. It is hidden from assistive technology, because a screen reader reads the focused
 *   cell with its headings, and the tooltip's live region is off.
 */

import { type ReactElement, type ReactNode, useRef } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { Tooltip, type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";
import { withContext } from "#heat/context.ts";
import { CLIPPED, READOUT_X, READOUT_Y } from "#heat/recipe.ts";
import { cellIn } from "#heat/walk.ts";

/**
 * Renders the `div` around the tooltip.
 */
const Box = withContext("div", "readout");

/**
 * Lists the one entry the kit's tooltip needs before it writes a heading and rows.
 */
const ENTRY: readonly TooltipEntry[] = [{}];

/**
 * Describes the props of the readout: the cell it shows and what it writes.
 */
export interface ReadoutProps {
  /**
   * Heading of the readout, such as the cell's row and column.
   */
  readonly heading: ReactNode;

  /**
   * Rows of the readout, such as the value's name and the value.
   */
  readonly rows: readonly TooltipRow[];

  /**
   * Key of the cell the readout shows, or undefined while it shows none.
   */
  readonly target: string | undefined;
}

/**
 * Returns whether no part of a box is inside another box.
 */
function outside(inner: DOMRect, outer: DOMRect): boolean {
  return (
    Math.min(inner.right, outer.right) <= Math.max(inner.left, outer.left) ||
    Math.min(inner.bottom, outer.bottom) <= Math.max(inner.top, outer.top)
  );
}

/**
 * Places the readout above its cell, centred on it and inside the frame, and below the cell where
 * the frame has no room above. Marks it clipped while the cell is out of the scroll area's view.
 *
 * @param readout - The readout's element.
 * @param frame - The frame, whose first child is the grid's scroll area.
 * @param target - The key of the cell.
 */
function place(readout: HTMLElement, frame: HTMLElement, target: string): void {
  const cell = cellIn(frame, target);

  if (cell === undefined) return;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the frame renders the grid's scroll area before the readout
  const view = frame.firstElementChild as Element;
  const box = frame.getBoundingClientRect();
  const at = cell.getBoundingClientRect();
  const half = readout.offsetWidth / 2;
  const middle = Math.min(Math.max(at.left + at.width / 2 - box.left, half), box.width - half);

  readout.style.setProperty(READOUT_X, `${String(middle)}px`);
  readout.style.setProperty(READOUT_Y, `${String(at.top - box.top)}px`);
  delete readout.dataset["side"];

  if (readout.getBoundingClientRect().top < box.top) {
    readout.dataset["side"] = "bottom";
    readout.style.setProperty(READOUT_Y, `${String(at.bottom - box.top)}px`);
  }

  readout.toggleAttribute(CLIPPED, outside(at, view.getBoundingClientRect()));
}

/**
 * Renders the kit's tooltip over the cell the walk shows, or nothing while it shows none.
 *
 * @param props - The cell's key, the heading and the rows.
 */
export function Readout({ heading, rows, target }: ReadoutProps): null | ReactElement {
  const box = useRef<HTMLDivElement>(null);

  useSafeLayoutEffect((): (() => void) | undefined => {
    if (target === undefined) return undefined;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the box renders while the readout has a target
    const readout = box.current as HTMLDivElement;
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the frame renders the readout as its child
    const frame = readout.parentElement as HTMLElement;

    /**
     * Places the readout at its cell's current position.
     */
    const follow = (): void => {
      place(readout, frame, target);
    };
    const resized = new ResizeObserver(follow);

    follow();
    resized.observe(frame);
    frame.addEventListener("scroll", follow, { capture: true, passive: true });

    return (): void => {
      resized.disconnect();
      frame.removeEventListener("scroll", follow, { capture: true });
    };
  }, [heading, rows, target]);

  if (target === undefined) return null;

  return (
    <Box aria-hidden ref={box}>
      <Tooltip
        accessibilityLayer={false}
        active
        headingOf={() => heading}
        payload={ENTRY}
        rowsOf={() => rows}
      />
    </Box>
  );
}
