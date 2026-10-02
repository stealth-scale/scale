/**
 * Hides the words of a node that leave the plot's sides or meet the words of a node earlier in the
 * keyboard walk, such as a sankey's names beside its bars, a chord diagram's names around its ring
 * or the words beside a scatter's points.
 *
 * @remarks
 *   Two names that meet read as other words. After each layout that moves a node's words or changes
 *   them, the node measures its lines and marks each with `data-overflow`, which the recipe hides,
 *   where one leaves the plot's sides or meets a line a node earlier in the walk shows. Two lines
 *   meet where they are less than 6px apart across and their middles are less than 1.5 times their
 *   font size apart, the spacing of two lines of one paragraph. The font size sets the distance
 *   because a line's box differs by engine: 22px tall in Firefox and 18px in Chromium for a 12.6px
 *   line. The nodes are the groups with the node class, so the node the walk visits first keeps its
 *   words. The tooltip and the walk still name a node whose words are hidden.
 */

import { type RefObject } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { NODE, OVERFLOW } from "#chart/recipe.ts";

/**
 * Space two lines of words keep apart across, in pixels.
 */
const SPACE = 6;

/**
 * Distance two lines' middles keep apart, in their font size.
 */
const LEADING = 1.5;

/**
 * Describes a line of words as it is laid out: its box and its font size in pixels.
 */
interface Line {
  /**
   * Box of the line on the page.
   */
  readonly box: DOMRect;

  /**
   * Font size of the line in pixels.
   */
  readonly size: number;
}

/**
 * Returns a line's box and its font size.
 */
function lineOf(text: SVGTextElement): Line {
  return {
    box: text.getBoundingClientRect(),
    // eslint-disable-next-line unicorn/prefer-number-coercion -- a computed font size ends in px, which Number reads as NaN
    size: Number.parseFloat(getComputedStyle(text).fontSize),
  };
}

/**
 * Returns the middle of a box's height.
 */
function middleOf(box: DOMRect): number {
  return box.top + box.height / 2;
}

/**
 * Returns whether two lines meet: they are less than the space two lines keep apart across, and
 * their middles are closer than the distance two lines keep apart, so they would read as one text.
 */
function meets(first: Line, second: Line): boolean {
  return (
    first.box.left < second.box.right + SPACE &&
    second.box.left < first.box.right + SPACE &&
    Math.abs(middleOf(first.box) - middleOf(second.box)) <
      (LEADING * (first.size + second.size)) / 2
  );
}

/**
 * Returns whether a node's words leave the plot's sides or meet the words a node earlier in the
 * walk shows.
 */
function blocked(group: SVGGElement): boolean {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts renders every node inside the chart's svg
  const plot = group.ownerSVGElement as SVGSVGElement;
  const bounds = plot.getBoundingClientRect();
  const walk = Number(group.dataset["walk"]);
  const shown = [...plot.querySelectorAll<SVGGElement>(`.${NODE}`)]
    .filter((node) => Number(node.dataset["walk"]) < walk)
    .flatMap((node) => Array.from(node.querySelectorAll("text")))
    .filter((text) => text.dataset["overflow"] === undefined)
    .map((text) => lineOf(text));

  return [...group.querySelectorAll("text")]
    .map((text) => lineOf(text))
    .some(
      (line) =>
        line.box.left < bounds.left ||
        line.box.right > bounds.right ||
        shown.some((other) => meets(line, other)),
    );
}

/**
 * Marks a node's words with `data-overflow` after each layout that moves or changes them, where a
 * line leaves the plot's sides or meets a line a node earlier in the walk shows.
 *
 * @param group - The node's group, which has the node class and its place in the walk.
 * @param layout - The node's words and where they are, joined, which change when a line moves.
 */
export function useCleared(group: RefObject<null | SVGGElement>, layout: string): void {
  useSafeLayoutEffect(() => {
    const node = group.current;

    if (node === null) return;

    const hidden = blocked(node);

    for (const text of node.querySelectorAll("text")) text.toggleAttribute(OVERFLOW, hidden);
  }, [group, layout]);
}
