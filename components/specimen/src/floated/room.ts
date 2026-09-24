/**
 * Computes the padding a floated box needs around the positioners inside it.
 */

import { type ROOM } from "#floated/recipe.ts";

/**
 * Describes the padding each side of the box needs, in pixels.
 */
export type Room = Readonly<Record<keyof typeof ROOM, number>>;

/**
 * Padding of a box whose positioners fit inside it.
 */
export const NONE: Room = { blockEnd: 0, blockStart: 0, inlineEnd: 0, inlineStart: 0 };

/**
 * Returns the padding a box needs so every rectangle fits inside its padding box.
 *
 * @param own - The box's border-box rectangle, which includes the padding it has now.
 * @param placed - The positioners' rectangles. A rectangle without area is skipped.
 * @param was - The padding the box has now.
 * @returns The padding each side needs, rounded up to whole pixels.
 */
export function roomFor(own: DOMRectReadOnly, placed: readonly DOMRectReadOnly[], was: Room): Room {
  const sized = placed.filter((rect) => rect.width > 0 && rect.height > 0);
  const inner = {
    bottom: own.bottom - was.blockEnd,
    left: own.left + was.inlineStart,
    right: own.right - was.inlineEnd,
    top: own.top + was.blockStart,
  };

  return {
    blockEnd: Math.max(0, ...sized.map((rect) => Math.ceil(rect.bottom - inner.bottom))),
    blockStart: Math.max(0, ...sized.map((rect) => Math.ceil(inner.top - rect.top))),
    inlineEnd: Math.max(0, ...sized.map((rect) => Math.ceil(rect.right - inner.right))),
    inlineStart: Math.max(0, ...sized.map((rect) => Math.ceil(inner.left - rect.left))),
  };
}

/**
 * Returns whether two paddings are equal on every side.
 *
 * @param one - The first padding.
 * @param other - The second padding.
 * @returns True when every side is equal.
 */
export function same(one: Room, other: Room): boolean {
  return (
    one.blockEnd === other.blockEnd &&
    one.blockStart === other.blockStart &&
    one.inlineEnd === other.inlineEnd &&
    one.inlineStart === other.inlineStart
  );
}
