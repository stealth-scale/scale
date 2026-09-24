/**
 * Renders its children at one width of the page and nothing at the other.
 *
 * @remarks
 *   A page swaps parts rather than shrinking them: a trail of crumbs becomes a single link back,
 *   a strip of tabs becomes a picker, a row of controls becomes a menu. The caller writes both
 *   parts, and this component decides which one renders. It renders no element of its own, so a
 *   part inside keeps its area in the header's grid. The width is the page's own measurement, so
 *   a page beside an open sidebar swaps on its own room.
 */

import { type ReactNode } from "react";

import { shown, usePage, type WhenProps } from "#page/state.ts";

/**
 * Describes the props of the switch: the width and the parts that render at it.
 */
export interface WhenComponentProps extends WhenProps {
  /**
   * The parts that render at the width.
   */
  readonly children?: ReactNode | undefined;
}

/**
 * Renders its children at the width it names, and nothing at the other.
 *
 * @param props - The width, and the parts that render at it.
 * @returns The children, or `null`.
 */
export function When({ children, when }: WhenComponentProps): ReactNode {
  const page = usePage();

  return shown(when, page.narrow) ? children : null;
}
