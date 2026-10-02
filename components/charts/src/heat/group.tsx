/**
 * Renders the heading of a group of a heat grid's columns, such as a calendar's month over its
 * weeks.
 *
 * @remarks
 *   The heading spans the group's columns. Its words start at the group's first column and are
 *   placed out of the table's layout, so a group never widens its columns. The heading measures its
 *   words after layout and again whenever they or the heading resize, and states `data-overflow` on
 *   words wider than the group, which the recipe hides from sight while a screen reader still reads
 *   them. A hidden heading renders its words for a screen reader alone.
 */

import { type ReactElement, type ReactNode, useRef } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { GroupHeading, GroupLabel, Hidden } from "#heat/grid.ts";
import { OVERFLOW } from "#heat/recipe.ts";

/**
 * Describes the props of a group's heading: its words and how many columns it spans.
 */
export interface GroupProps {
  /**
   * Whether a screen reader reads the words alone.
   */
  readonly hidden: boolean;

  /**
   * Words of the heading.
   */
  readonly label: ReactNode;

  /**
   * Number of columns the group spans.
   */
  readonly span: number;
}

/**
 * Renders the group's heading over its columns, with its words hidden from sight while they are
 * wider than the group.
 *
 * @param props - The words, whether they are hidden and the number of columns.
 */
export function Group({ hidden, label, span }: GroupProps): ReactElement {
  const words = useRef<HTMLSpanElement>(null);

  useSafeLayoutEffect((): (() => void) | undefined => {
    const shown = words.current;

    if (shown === null) return undefined;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the words render inside the group's heading
    const cell = shown.parentElement as HTMLElement;

    /**
     * Marks the words while they are wider than the group.
     */
    const fit = (): void => {
      shown.toggleAttribute(OVERFLOW, shown.offsetWidth > cell.clientWidth);
    };
    const resized = new ResizeObserver(fit);

    fit();
    resized.observe(cell);
    resized.observe(shown);

    return (): void => {
      resized.disconnect();
    };
  }, [hidden, label]);

  return (
    <GroupHeading colSpan={span}>
      {hidden ? <Hidden>{label}</Hidden> : <GroupLabel ref={words}>{label}</GroupLabel>}
    </GroupHeading>
  );
}
